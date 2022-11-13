from django.contrib.postgres.fields import ArrayField
from django.db import models


class Title(models.Model):
    tconst = models.CharField(primary_key=True, max_length=9)
    titleType = models.CharField(max_length=32)
    primaryTitle = models.CharField(max_length=256)
    originalTitle = models.CharField(max_length=256)
    startYear = models.IntegerField()
    endYear = models.IntegerField()
    runtimeMinutes = models.IntegerField()
    genres = ArrayField(models.CharField(max_length=64))


class Episode(models.Model):
    tconst = models.CharField(primary_key=True, max_length=9)
    parentTconst = models.ForeignKey(Title, on_delete=models.CASCADE)
    seasonNumber = models.IntegerField()
    episodeNumber = models.IntegerField()


class Rating(models.Model):
    tconst = models.OneToOneField(Title, primary_key=True, on_delete=models.CASCADE, max_length=9)
    averageRating = models.FloatField()
    numVotes = models.IntegerField()
