dataset_details = {
    "Title": {
        "url": "https://datasets.imdbws.com/title.basics.tsv.gz",
        "converters": {"genres": lambda x: x.split(",") if x != "\\N" else []},
        "cols": {
            "tconst": str,
            "titleType": str,
            "primaryType": str,
            "originalTitle": str,
            "isAdult": bool,
            "startYear": int,
            "endYear": int,
            "runtimeMinutes": int,
            "genres": list
        },
    },
    "Episode": {
        "url": "https://datasets.imdbws.com/title.episode.tsv.gz",
        "converters": None,
        "cols": {
            "tconst": str,
            "parentTconst": str,
            "seasonNumber": int,
            "episodeNumber": int
        },
    },
    "Rating": {
        "url": "https://datasets.imdbws.com/title.ratings.tsv.gz",
        "converters": None,
        "cols": {
            "tconst": str,
            "averageRating": float,
            "numVotes": int
        }
    }
}
