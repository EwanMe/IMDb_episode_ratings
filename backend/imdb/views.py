import csv
import gzip
import imdb.models
import pandas as pd
import urllib.request

from imdb.datasets import dataset_details
from django.http import HttpResponse
from io import TextIOWrapper


def download_entries(Model, details):
    with urllib.request.urlopen(details["url"]) as res:
        with TextIOWrapper(gzip.GzipFile(fileobj=res, mode="r")) as tsv_file:
            df = pd.read_csv(
                tsv_file,
                delimiter="\t",
                quoting=csv.QUOTE_NONE,
                dtype=str,
                converters=details["converters"],
            )

            df = df.replace({"\\N": None})

            def eval_type(var, constructor):
                return None if var is None else constructor(var)

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


def download_title_basics(_):
    for model, details in dataset_details.items():
        download_entries(getattr(imdb.models, model), details)

    return HttpResponse()
