# Generated by Django 4.0.1 on 2022-01-21 15:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_id', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=250)),
                ('popularity', models.IntegerField(null=True)),
                ('followers', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('seed_genre', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='GenreTrack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_genre', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('genre', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotify.genre')),
            ],
        ),
        migrations.CreateModel(
            name='Track',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_id', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=250)),
                ('album', models.CharField(max_length=200)),
                ('danceability', models.FloatField()),
                ('loudness', models.FloatField()),
                ('speechiness', models.FloatField()),
                ('acousticness', models.FloatField()),
                ('instrumentalness', models.FloatField()),
                ('liveness', models.FloatField()),
                ('valence', models.FloatField()),
                ('energy', models.FloatField()),
                ('arousal', models.FloatField()),
                ('tempo', models.FloatField()),
                ('duration', models.BigIntegerField()),
                ('key', models.IntegerField()),
                ('mode', models.IntegerField()),
                ('time_signature', models.IntegerField()),
                ('popularity', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('artists', models.ManyToManyField(related_name='tracks', to='spotify.Artist')),
                ('genres', models.ManyToManyField(related_name='tracks', through='spotify.GenreTrack', to='spotify.Genre')),
            ],
        ),
        migrations.CreateModel(
            name='SpotifyToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=50, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('refresh_token', models.CharField(max_length=200)),
                ('access_token', models.CharField(max_length=200)),
                ('expires_in', models.DateTimeField()),
                ('token_type', models.CharField(max_length=50)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='genretrack',
            name='track',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotify.track'),
        ),
        migrations.CreateModel(
            name='GenreArtist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_genre', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('artist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotify.artist')),
                ('genre', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='spotify.genre')),
            ],
        ),
        migrations.AddField(
            model_name='artist',
            name='genres',
            field=models.ManyToManyField(related_name='artists', through='spotify.GenreArtist', to='spotify.Genre'),
        ),
    ]
