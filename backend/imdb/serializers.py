from imdb.models import Title, Episode, Rating
from rest_framework import serializers


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = "__all__"


class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = (
            "tconst",
            "episodeNumber"
        )


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"


class TitleRatingSerializer(serializers.ModelSerializer):
    rating = RatingSerializer()

    class Meta:
        model = Title
        fields = "__all__"

    def to_representation(self, instance):
        represenation = super().to_representation(instance)
        rating_representation = represenation.pop("rating")
        for key in rating_representation:
            represenation[key] = rating_representation[key]

        return represenation


class EpisodeRatingSerializer(TitleRatingSerializer):
    class Meta:
        model = Title
        fields = (
            "rating",
            "primaryTitle"
        )


class EpisodeListEntrySerializer(EpisodeSerializer):
    tconst = EpisodeRatingSerializer()

    def to_representation(self, instance):
        represenation = super().to_representation(instance)
        title_represenation = represenation.pop("tconst")
        for key in title_represenation:
            represenation[key] = title_represenation[key]

        return represenation
