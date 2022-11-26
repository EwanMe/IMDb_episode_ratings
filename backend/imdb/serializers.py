from imdb.models import Title, Episode, Rating
from rest_framework import serializers


class TitleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Title
        fields = "__all__"


class EpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"


class TitleInfoSerializer(serializers.ModelSerializer):
    rating = RatingSerializer()

    class Meta:
        model = Title
        fields = "__all__"
