import csv
import gzip
import imdb.models
import os
import pandas as pd
import time
import urllib.request

from django.http import HttpResponse, Http404, JsonResponse, HttpResponseServerError
from imdb.datasets import dataset_details
from imdb.models import *
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


def download_entries(Model, details):
    tmp_file = f"/tmp/imdb_datasets/{details['url'].split('/')[-1]}"
    timeout = 7 * 24 * 60 * 60  # 1 week
    if not os.path.exists(tmp_file) or time.time() - os.path.getmtime(tmp_file) > timeout:
        print(f"Downloading file {details['url']}")
        urllib.request.urlretrieve(details["url"], tmp_file)

    with gzip.open(tmp_file, "r") as tsv_file:
        print(f"Converting file {tmp_file} to dataframe...")
        df = pd.read_csv(
            tsv_file,
            delimiter="\t",
            quoting=csv.QUOTE_NONE,
            dtype=str,
            converters=details["converters"],
            usecols=details["cols"].keys() if Model != Role else list(
                details["cols"].keys())[1:]
        )

        df = df.replace({"\\N": None})
        df = prune_datasets(Model, df)
        print(df)

        def eval_type(val, constructor):
            try:
                return None if val is None else constructor(val)
            except Exception as e:
                print(constructor, val, e)
                raise Exception("Holy fuck")

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
    try:
        for model, details in dataset_details.items():
            # if model in ["Title", "Episode", "Rating", "Person"]:
            #     continue
            download_entries(getattr(imdb.models, model), details)
    except Exception as e:
        print(e)
        return HttpResponseServerError()

    return HttpResponse()


# def get_show(_, id):
#     show = Title.objects.select_related(
#         "rating"
#     ).filter(
#         tconst=id
#     ).filter(
#         titleType="tvSeries"
#     )

#     if show:
#         serialzer = TitleRatingSerializer(show, many=True)
#         return JsonResponse(serialzer.data, safe=False)
#     else:
#         raise Http404(f"No TV show with ID: {id}")


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
