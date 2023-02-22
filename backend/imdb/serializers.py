from imdb.models import Title, Episode, Rating, Role, Person
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
            "episodeNumber",
        )


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ("primaryName",)


class RoleSerializer(serializers.ModelSerializer):
    nconst = PersonSerializer()

    class Meta:
        model = Role
        fields = "nconst", "ordering", "category"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        nconst_representation = representation.pop("nconst")
        for key in nconst_representation:
            representation[key] = nconst_representation[key]

        return representation


class TitleRatingSerializer(serializers.ModelSerializer):
    rating = RatingSerializer()
    title_roles = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = (
            "tconst",
            "primaryTitle",
            "startYear",
            "endYear",
            "rating",
            "genres",
            "title_roles",
        )

    def to_representation(self, instance):
        represenation = super().to_representation(instance)

        rating_representation = represenation.pop("rating")
        for key in rating_representation:
            represenation[key] = rating_representation[key]

        return represenation

    def get_title_roles(self, instance):
        queryset = instance.title_roles.order_by("ordering")
        return RoleSerializer(queryset, many=True).data


class EpisodeRatingSerializer(TitleRatingSerializer):
    class Meta:
        model = Title
        fields = (
            "rating",
            "primaryTitle",
        )


class EpisodeListEntrySerializer(EpisodeSerializer):
    tconst = EpisodeRatingSerializer()

    def to_representation(self, instance):
        represenation = super().to_representation(instance)
        title_represenation = represenation.pop("tconst")
        for key in title_represenation:
            represenation[key] = title_represenation[key]

        return represenation
