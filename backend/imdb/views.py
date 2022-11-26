import csv
import gzip
import imdb.models
import pandas as pd
import urllib.request

from django.http import HttpResponse, Http404, JsonResponse, HttpResponseServerError
from imdb.datasets import dataset_details
from imdb.models import Title, Episode, Rating
from imdb.serializers import TitleInfoSerializer, TitleSerializer
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


def get_show(_, id):
    show = Title.objects.select_related("rating").filter(tconst=id)

    if show:
        serialzer = TitleInfoSerializer(show, many=True)
        return JsonResponse(serialzer.data, safe=False)
    else:
        raise Http404(f"No TV show with ID: {id}")
