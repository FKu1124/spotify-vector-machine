from pyexpat import model
from django.db import models
from django.contrib.auth.models import User

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
    name = models.CharField(max_length=250)

    genres = models.CharField(max_length=500)
    artists = models.CharField(max_length=500)
    album = models.CharField(max_length=300)

    danceability = models.FloatField()
    loudness = models.FloatField()
    speechiness = models.FloatField()
    acousticness = models.FloatField()
    instrumentalness = models.FloatField()
    liveness = models.FloatField()
    valence = models.FloatField()
    energy = models.FloatField()
    tempo = models.FloatField()
    duration = models.BigIntegerField()
    key = models.IntegerField()
    mode = models.IntegerField()
    time_signature = models.IntegerField()
    popularity = models.IntegerField()

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