dataset_details = {
    "Title": {
        "url": "https://datasets.imdbws.com/title.basics.tsv.gz",
        "converters": {"genres": lambda x: x.split(",") if x != "\\N" else []},
        "cols": {
            "tconst": str,
            "titleType": str,
            "primaryTitle": str,
            "startYear": int,
            "endYear": int,
            "genres": list,
        },
    },
    "Episode": {
        "url": "https://datasets.imdbws.com/title.episode.tsv.gz",
        "converters": None,
        "cols": {
            "tconst": str,
            "parentTconst": str,
            "seasonNumber": int,
            "episodeNumber": int,
        },
    },
    "Rating": {
        "url": "https://datasets.imdbws.com/title.ratings.tsv.gz",
        "converters": None,
        "cols": {
            "tconst": str,
            "averageRating": float,
            "numVotes": int,
        },
    },
    "Person": {
        "url": "https://datasets.imdbws.com/name.basics.tsv.gz",
        "converters": None,
        "cols": {
            "nconst": str,
            "primaryName": str,
        },
    },
    "Role": {
        "url": "https://datasets.imdbws.com/title.principals.tsv.gz",
        "converters": None,
        "cols": {
            "id": None,
            "tconst": str,
            "ordering": int,
            "nconst": str,
            "category": str,
        },
    },
}
