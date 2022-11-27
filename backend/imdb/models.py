from django.contrib.postgres.fields import ArrayField
from django.db import models


class Title(models.Model):
    tconst = models.CharField(primary_key=True, max_length=64)
    titleType = models.CharField(max_length=32)
    primaryTitle = models.CharField(max_length=1024)
    originalTitle = models.CharField(max_length=1024)
    isAdult = models.BooleanField(blank=True, null=True)
    startYear = models.IntegerField(blank=True, null=True)
    endYear = models.IntegerField(default=None, blank=True, null=True)
    runtimeMinutes = models.IntegerField(blank=True, null=True)
    genres = ArrayField(models.CharField(max_length=64), blank=True, null=True)

    def __str__(self):
        return "%s: %s" % (self.tconst, self.primaryTitle)


class Episode(models.Model):
    tconst = models.OneToOneField(
        Title, primary_key=True, on_delete=models.CASCADE, max_length=32, related_name="episode")
    parentTconst = models.ForeignKey(
        Title, on_delete=models.CASCADE, db_constraint=False, related_name="seriesEpisodes")
    seasonNumber = models.IntegerField(blank=True, null=True)
    episodeNumber = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return "%s: %s s%se%s" % (self.tconst, self.parentTconst, self.seasonNumber, self.episodeNumber)


class Rating(models.Model):
    tconst = models.OneToOneField(
        Title, primary_key=True, on_delete=models.CASCADE, max_length=32)
    averageRating = models.FloatField()
    numVotes = models.IntegerField()

    def __str__(self):
        return "%s: %s (%s)" % (self.tconst, self.averageRating, self.numVotes)
