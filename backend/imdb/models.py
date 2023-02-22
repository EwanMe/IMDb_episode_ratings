from django.contrib.postgres.fields import ArrayField
from django.db import models


class Title(models.Model):
    tconst = models.CharField(primary_key=True, max_length=32)
    titleType = models.CharField(max_length=32)
    primaryTitle = models.CharField(max_length=1024)
    startYear = models.IntegerField(blank=True, null=True)
    endYear = models.IntegerField(default=None, blank=True, null=True)
    genres = ArrayField(models.CharField(max_length=64), blank=True, null=True)

    def __str__(self):
        return "%s %s" % (self.tconst, self.primaryTitle)


class Episode(models.Model):
    tconst = models.OneToOneField(
        to=Title,
        primary_key=True,
        on_delete=models.CASCADE,
        max_length=32,
        related_name="episode",
    )
    parentTconst = models.ForeignKey(
        to=Title,
        on_delete=models.CASCADE,
        max_length=32,
        related_name="series",
    )
    seasonNumber = models.IntegerField(blank=True, null=True)
    episodeNumber = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return "%s in %s s%se%s" % (
            self.tconst,
            self.parentTconst,
            self.seasonNumber,
            self.episodeNumber,
        )


class Rating(models.Model):
    tconst = models.OneToOneField(
        to=Title, primary_key=True, on_delete=models.CASCADE, max_length=32
    )
    averageRating = models.FloatField()
    numVotes = models.IntegerField()

    def __str__(self):
        return "%s rated %s (%s votes)" % (
            self.tconst,
            self.averageRating,
            self.numVotes,
        )


class Person(models.Model):
    nconst = models.CharField(primary_key=True, max_length=32)
    primaryName = models.CharField(max_length=1024)

    def __str__(self):
        return "%s %s" % (self.nconst, self.primaryName)


class Role(models.Model):
    tconst = models.ForeignKey(
        to=Title,
        on_delete=models.CASCADE,
        max_length=32,
        related_name="title_roles",
    )
    ordering = models.IntegerField()
    nconst = models.ForeignKey(
        to=Person, on_delete=models.CASCADE, max_length=32, related_name="role"
    )
    category = models.CharField(max_length=1024)

    def __str__(self):
        return "%s %s : %s" % (self.tconst, self.nconst, self.category)
