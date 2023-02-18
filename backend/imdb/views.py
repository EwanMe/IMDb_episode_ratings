import csv
import gzip
import imdb.models
import os
import pandas as pd
import psutil
import time
import urllib.request

from django.http import HttpResponse, Http404, JsonResponse, HttpResponseServerError
from imdb.datasets import dataset_details
from imdb.models import Title, Episode, Rating, Person, Role
from imdb.serializers import *


def prune_datasets(Model, df):
    if Model == Title:
        df = df.drop(
            df[~df["titleType"].isin(["tvSeries", "tvEpisode", "short"])].index)
    if Model == Episode:
        tconsts = list(Title.objects.values_list("tconst", flat=True))

        df = df.drop(
            df[~df["parentTconst"].isin(tconsts)].index)

        # Remove titles with no related episodes
        # Mainly targeting standalone titles of type "short", which are not part of a tv series.
        # for t in tconsts:
        #     query = Title.objects.filter(tconst=t)
        #     if not query.select_related("episode"):
        #         query.delete()
    elif Model == Rating:
        tconsts = list(Title.objects.values_list("tconst", flat=True))
        df = df.drop(
            df[~df["tconst"].isin(tconsts)].index)
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


def store_dataframe(df, Model, details):
    df = df.replace({"\\N": None})
    df = prune_datasets(Model, df)
    print(df)

    def eval_type(val, constructor):
        return None if val is None else constructor(val)

    entries = list(
        map(
            lambda cols: Model(
                *[eval_type(cols[i], constructor)
                    for i, constructor in enumerate(details["cols"].values())]
            ),
            df.values.tolist()
        )
    )
    Model.objects.bulk_create(
        entries, batch_size=10000, ignore_conflicts=True)


def download_entries(Model, details):
    tmp_file = f"/tmp/imdb_datasets/{details['url'].split('/')[-1]}"
    timeout = 7 * 24 * 60 * 60  # 1 week
    if not os.path.exists(tmp_file) or time.time() - os.path.getmtime(tmp_file) > timeout:
        print(f"Downloading file {details['url']}")
        urllib.request.urlretrieve(details["url"], tmp_file)

    with gzip.open(tmp_file, "r") as tsv_file:
        print(f"Converting file {tmp_file} to dataframe...")
        chunksize = 10 ** 6
        chunks = pd.read_csv(
            tsv_file,
            delimiter="\t",
            quoting=csv.QUOTE_NONE,
            dtype=str if not details["converters"] else None,
            chunksize=chunksize,
            converters=details["converters"],
            usecols=details["cols"].keys() if Model != Role else list(
                details["cols"].keys())[1:]
        )

        df = pd.DataFrame()

        for i, chunk in enumerate(chunks):
            df = pd.concat([df, pd.DataFrame(chunk)], ignore_index=True)

            df_mem = df.memory_usage(deep=True).sum() / 1024**3
            avail_mem = psutil.virtual_memory().total / 1024**3
            print(f"Dataframe used {round(df_mem, 2)}GB/{round(avail_mem, 2)}GB")

            # Store and reset df if next chunk supasses allowed memory usage
            if df_mem + df_mem/(i+1) > avail_mem * 0.75:
                store_dataframe(df, Model, details)
                df = df.iloc[0:0]

        store_dataframe(df, Model, details)


def download_title_basics(_):
    try:
        for model, details in dataset_details.items():
            download_entries(getattr(imdb.models, model), details)
    except Exception as e:
        print(e)
        return HttpResponseServerError()

    return HttpResponse()


def get_show(_, id):
    show = Title.objects.select_related(
        "rating"
    ).prefetch_related(
        "title_roles__nconst"
    ).filter(
        tconst=id
    ).filter(
        titleType="tvSeries"
    )
    
    if show:
        serialzer = TitleRatingSerializer(show, many=True)
        return JsonResponse(serialzer.data, safe=False)
    else:
        raise Http404(f"No TV show with ID: {id}")


def get_season_ratings(_, id, season):
    episodes = Episode.objects.filter(
        parentTconst=id,
    ).filter(
        seasonNumber=season
    ).order_by(
        "episodeNumber"
    ).select_related("parentTconst")

    if episodes:
        serializer = EpisodeListEntrySerializer(episodes, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        raise Http404(f"No TV show with ID: {id}")
