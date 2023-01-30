# Generated by Django 4.1.3 on 2023-01-30 19:20

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('nconst', models.CharField(max_length=32, primary_key=True, serialize=False)),
                ('primaryName', models.CharField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='Title',
            fields=[
                ('tconst', models.CharField(max_length=32, primary_key=True, serialize=False)),
                ('titleType', models.CharField(max_length=32)),
                ('primaryTitle', models.CharField(max_length=1024)),
                ('startYear', models.IntegerField(blank=True, null=True)),
                ('endYear', models.IntegerField(blank=True, default=None, null=True)),
                ('genres', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=64), blank=True, null=True, size=None)),
            ],
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('tconst', models.OneToOneField(max_length=32, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='imdb.title')),
                ('averageRating', models.FloatField()),
                ('numVotes', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ordering', models.IntegerField()),
                ('category', models.CharField(max_length=1024)),
                ('nconst', models.ForeignKey(max_length=32, on_delete=django.db.models.deletion.CASCADE, to='imdb.person')),
                ('tconst', models.ForeignKey(max_length=32, on_delete=django.db.models.deletion.CASCADE, to='imdb.title')),
            ],
        ),
        migrations.CreateModel(
            name='Episode',
            fields=[
                ('tconst', models.OneToOneField(max_length=32, on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='episode', serialize=False, to='imdb.title')),
                ('seasonNumber', models.IntegerField(blank=True, null=True)),
                ('episodeNumber', models.IntegerField(blank=True, null=True)),
                ('parentTconst', models.ForeignKey(max_length=32, on_delete=django.db.models.deletion.CASCADE, related_name='seriesEpisodes', to='imdb.title')),
            ],
        ),
    ]
