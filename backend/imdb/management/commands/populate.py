import csv
import gzip
import imdb.models
import os
import pandas as pd
import subprocess
import time
import urllib.request

from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.db.models import Model
from imdb.datasets import dataset_details
from imdb.models import Title, Episode, Rating, Person, Role
from typing import Any


class Command(BaseCommand):
    """Management command for populating database with data from tsv files"""

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "tables",
            nargs="+",
            type=str,
            choices=[table.lower() for table in dataset_details.keys()],
        )

    def handle(self, *args: Any, **options: Any) -> str | None:
        for table in options["tables"]:
            self.populate_database(table)

    def prune_datasets(self, Model: Model, df: pd.DataFrame) -> pd.DataFrame:
        """
        prunes superflous rows from dataframe

        Args:
            Model:  database model related to the dataframe
            df:     dataframe to prune

        Returns:
            pruned dataframe
        """

        if Model == Title:
            df = df.drop(
                df[
                    ~df["titleType"].isin(["tvSeries", "tvEpisode", "short"])
                ].index
            )
        if Model == Episode:
            tconsts = list(Title.objects.values_list("tconst", flat=True))

            df = df.drop(
                df[
                    ~df["parentTconst"].isin(tconsts)
                    | ~df["tconst"].isin(tconsts)
                ].index
            )

            # Remove titles with no related episodes
            # Mainly targeting standalone titles of type "short",
            # which are not part of a tv series.
            # for t in tconsts:
            #     query = Title.objects.filter(tconst=t)
            #     if not query.select_related("episode"):
            #         query.delete()
        elif Model == Rating:
            tconsts = list(Title.objects.values_list("tconst", flat=True))
            df = df.drop(df[~df["tconst"].isin(tconsts)].index)
        elif Model == Role:
            tconsts = list(Title.objects.values_list("tconst", flat=True))
            nconsts = list(Person.objects.values_list("nconst", flat=True))

            df = df.drop(
                df[
                    ~df["tconst"].isin(tconsts)
                    | ~df["nconst"].isin(nconsts)
                    | ~df["category"].isin(
                        ["director", "writer", "actor", "actress", "self"]
                    )
                ].index
            )

            df.insert(loc=0, column="id", value=None)

            # Remove Persons unrelated to any TV series title
            # nconsts = list(Role.objects.values_list("nconst", flat=True))
            # df = df.drop(df[~df["nconst"].isin(nconsts)].index)

            # nconsts = df["nconst"].tolist()
            # c = Person.objects.exclude(nconst__in=nconsts).count()
            # print("rows: ", c)

        return df

    def store_dataframe(
        self, df: pd.DataFrame, Model: Model, details: dict[str, Any]
    ) -> None:
        """
        insert dataframe rows into database

        Args:
            df:       dataframe to insert
            Model:    database model to populate
            details:  dataset meta data
        """

        df = df.replace({"\\N": None})
        df = self.prune_datasets(Model, df)

        def eval_type(val, constructor):
            """
            applies the constructor to val if it's defined
            """
            return None if val is None else constructor(val)

        entries = list(
            map(
                lambda cols: Model(
                    *[
                        eval_type(cols[i], constructor)
                        for i, constructor in enumerate(
                            details["cols"].values()
                        )
                    ]
                ),
                df.values.tolist(),
            )
        )

        self.stdout.write("Storing rows in database...")
        Model.objects.bulk_create(
            entries, batch_size=10000, ignore_conflicts=True
        )

    def get_dataset(self, details: dict[str, Any]) -> str:
        """
        downloads file from url specified in details and stores the tsv in a
        temporary file

        Args:
            details:  map of dataset meta data

        Returns:
            path to temp file
        """

        tmp_file = os.path.join(
            "/tmp", "imdb_datasets", details["url"].split("/")[-1]
        )

        timeout = 7 * 24 * 60 * 60  # 1 week
        if (
            not os.path.exists(tmp_file)
            or time.time() - os.path.getmtime(tmp_file) > timeout
        ):
            self.stdout.write(f"Downloading file {details['url']}")
            urllib.request.urlretrieve(details["url"], tmp_file)

        return tmp_file

    def get_memory_limit(self) -> float:
        """
        Retrieves memory limit of system in gibibytes

        Raises:
            OSError: if cgroup version couldn't be determined

        Returns:
            available memory in GiB
        """

        output = (
            subprocess.check_output(["stat", "-fc", "%T", "/sys/fs/cgroup/"])
            .decode("utf-8")
            .strip()
        )

        if output == "tmpfs":
            path = "/sys/fs/cgroup/memory/memory.limit_in_bytes"
        elif output == "cgroup2fs":
            path = "/sys/fs/cgroup/memory.max"
        else:
            raise OSError("Could not determine cgroup version")

        avail_mem = int(
            subprocess.check_output(["cat", path]).decode("utf-8")
        ) / (1024**3)
        return avail_mem

    def populate_table(self, Model: Model, details: dict[str, Any]) -> None:
        """
        download tsv dataset, convert to dataframe, and insert into database

        Args:
            Model:    database model to populate
            details:  dataset meta data
        """

        tmp_file = self.get_dataset(details)

        with gzip.open(tmp_file, "r") as tsv_file:
            self.stdout.write(f"Converting file {tmp_file} to dataframe...")
            chunksize = 10**6
            chunks = pd.read_csv(
                tsv_file,
                delimiter="\t",
                quoting=csv.QUOTE_NONE,
                dtype=str if not details["converters"] else None,
                chunksize=chunksize,
                converters=details["converters"],
                usecols=details["cols"].keys()
                if Model != Role
                else list(details["cols"].keys())[1:],
            )

            df = pd.DataFrame()

            # Load tsv chunkwise into dataframe to manage memory usage
            for i, chunk in enumerate(chunks):
                df = pd.concat([df, pd.DataFrame(chunk)], ignore_index=True)

                df_mem = df.memory_usage(deep=True).sum() / 1024**3
                avail_mem = self.get_memory_limit()
                self.stdout.write(
                    f"Dataframe used {round(df_mem, 2)}GB/{round(avail_mem, 2)}GB"
                )

                # Store and reset df if next chunk supasses allowed memory usage
                if df_mem + df_mem / (i + 1) > avail_mem * 0.5:
                    self.store_dataframe(df, Model, details)
                    df = df.iloc[0:0]

            self.store_dataframe(df, Model, details)

    def populate_database(self, table: str) -> None:
        """
        populates the specified tables of the database or all tables if none
        are provided

        Args:
            table:  table to populate. defaults to None.

        Raises:
            CommandError: if no table matches input
        """

        table = table and str(table).lower().capitalize()
        if table not in dataset_details.keys():
            CommandError(f'No table matching "{table}" was found.')

        try:
            for model, details in dataset_details.items():
                if not table or table == model:
                    self.populate_table(getattr(imdb.models, model), details)
        except Exception as e:
            self.stderr.write(self.style.ERROR(e))
