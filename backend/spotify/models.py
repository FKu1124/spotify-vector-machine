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


class Artist(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=250)
    popularity = models.IntegerField(null=True)
    followers = models.IntegerField(null=True)

    genres = models.ManyToManyField(Genre,
                                    related_name="artists",
                                    through="GenreArtist")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GenreArtist(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    base_genre = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Album(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=250)

    artists = models.ManyToManyField(Artist, related_name="albums")

    popularity = models.IntegerField()
    album_type = models.CharField(max_length=25, null=True)
    total_tracks = models.IntegerField(null=True)
    release_date = models.CharField(max_length=100, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def genres(self):
        genres = []
        for artist in self.artists.all():
            genres += artist.genres.all()
        return genres


class Track(models.Model):
    spotify_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=250)

    genres = models.ManyToManyField(Genre,
                                    related_name="tracks",
                                    through="GenreTrack")
    artists = models.ManyToManyField(Artist, related_name="tracks")
    album = models.ForeignKey(Album,
                              on_delete=models.DO_NOTHING,
                              related_name="tracks",
                              null=True)

    danceability = models.FloatField()
    loudness = models.FloatField()
    speechiness = models.FloatField()
    acousticness = models.FloatField()
    instrumentalness = models.FloatField()
    liveness = models.FloatField()
    valence = models.FloatField()
    energy = models.FloatField()
    arousal = models.FloatField()
    tempo = models.FloatField()
    duration = models.BigIntegerField()
    key = models.IntegerField()
    mode = models.IntegerField()
    time_signature = models.IntegerField()
    popularity = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GenreTrack(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)

    base_genre = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
