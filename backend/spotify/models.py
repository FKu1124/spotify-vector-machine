from pyexpat import model
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

# Create your models here.


class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=200)
    access_token = models.CharField(max_length=200)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# class Artist(models.Model):
#     spotify_id = models.CharField(max_length=50, unique=True)
#     name = models.CharField(max_length=250)
#     popularity = models.IntegerField(null=True)
#     followers = models.IntegerField(null=True)

#     genres = models.ManyToManyField(Genre,
#                                     related_name="artists",
#                                     through="GenreArtist")

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)


# class GenreArtist(models.Model):
#     genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
#     artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

#     base_genre = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Track(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=250, null=True)

    genres = models.CharField(max_length=500, null=True)
    artists = models.CharField(max_length=500, null=True)
    album = models.CharField(max_length=300, null=True)

    danceability = models.FloatField(null=True)
    loudness = models.FloatField(null=True)
    speechiness = models.FloatField(null=True)
    acousticness = models.FloatField(null=True)
    instrumentalness = models.FloatField(null=True)
    liveness = models.FloatField(null=True)
    valence = models.FloatField(null=True)
    energy = models.FloatField(null=True)
    tempo = models.FloatField(null=True)
    duration = models.BigIntegerField(null=True)
    key = models.IntegerField(null=True)
    mode = models.IntegerField(null=True)
    time_signature = models.IntegerField(null=True)
    popularity = models.IntegerField(null=True)

    cluster = models.CharField(max_length=100, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# class GenreTrack(models.Model):
#     genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
#     track = models.ForeignKey(Track, on_delete=models.CASCADE)

#     base_genre = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Tag(models.Model):
    name = models.CharField(max_length=100)
    count = models.PositiveIntegerField()
    track = models.ForeignKey(Track, on_delete=models.CASCADE)


class UserTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)


class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    spotify_ids = ArrayField(models.CharField(max_length=50))
    weights = ArrayField(models.FloatField())

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_weights(self):
        spotify_id_to_weight = {}
        for spotify_id, weight in zip(spotify_ids, weights):
            spotify_id_to_weight[spotify_id] = weight

        return spotify_id_to_weight
