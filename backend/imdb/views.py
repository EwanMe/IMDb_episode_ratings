from django.db.models import F
from django.http import (
    Http404,
    JsonResponse,
    HttpResponseServerError,
)
from imdb.models import Title
from imdb.serializers import (
    TitleRatingSerializer,
    TitleFullSerializer,
    SeriesEpisodeRatingsSerializer,
)


def get_show(_, id: str) -> JsonResponse:
    """
    get json object with meta info about the tvseries title

    Args:
        _:   unused request
        id:  tconst format id of tvseries

    Raises:
        Http404: if title not found

    Returns:
        title info
    """

    show = (
        Title.objects.select_related("rating")
        .prefetch_related("title_roles__nconst")
        .filter(tconst=id)
        .filter(titleType="tvSeries")
    )

    if show:
        serialzer = TitleFullSerializer(show, many=True)
        return JsonResponse(serialzer.data, safe=False)
    else:
        raise Http404(f"No TV show with ID: {id}")


def get_episode_ratings(_, id: str) -> JsonResponse | HttpResponseServerError:
    """
    get ratings for all episodes of a tvseries grouped by season

    Args:
        _:   unused request
        id:  tconst format id of tvseries

    Raises:
        Http404: if title not found

    Returns:
        season ratings or error response
    """

    try:
        show = Title.objects.get(tconst=id)
    except Title.MultipleObjectsReturned:
        return HttpResponseServerError("Multiple shows with same ID found.")
    except Title.DoesNotExist:
        raise Http404(f"Show with ID: {id} not found.")

    if show:
        serializer = SeriesEpisodeRatingsSerializer(show)
        return JsonResponse(serializer.data, safe=False)
    else:
        raise Http404(f"No TV show with ID: {id}")


def get_free_search(request) -> JsonResponse:
    """
    Does a free search on show titles in the database

    Args:
        request:  the HTTP request

    Returns:
        list of matching titles
    """

    query = request.GET.get("q")
    shows = (
        Title.objects.select_related("rating")
        .filter(primaryTitle__icontains=query, titleType="tvSeries")
        .order_by(F("rating__numVotes").desc(nulls_last=True))
    )[:10]
    serializer = TitleRatingSerializer(shows, many=True)
    return JsonResponse(serializer.data, safe=False)


# select tconst, "titleType", "primaryTitle", "startYear", "averageRating" from imdb_title left join imdb_rating on tconst=tconst_id where "titleType"='tvSeries' and lower("primaryTitle") like '%%' order by "numVotes" desc nulls last limit 20;
