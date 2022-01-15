from curses import keyname
from enum import unique
from pyexpat import model
from django.db import models

# Create your models here.
class Track(models.Model):
  spotify_id = models.CharField(max_length=50, unique=True)
  name = models.CharField(max_length=200)
  album_id = models.CharField(max_length=50)
  album_name = models.CharField(max_length=200)
  # ToDo Multiple Artist handling
  artist_id = models.CharField(max_length=50)
  artist_name = models.CharField(max_length=200)

  key = models.IntegerField()
  mode = models.IntegerField()
  tempo = models.IntegerField()
  duration = models.PositiveBigIntegerField()
  time_signature = models.IntegerField()

  ft_danceability = models.FloatField()
  ft_energy = models.FloatField()
  ft_loudness = models.FloatField()
  ft_speechiness = models.FloatField()
  ft_acousticness = models.FloatField()
  ft_instrumentalness = models.FloatField()
  ft_liveness = models.FloatField()
  ft_valence = models.FloatField()

class Genre(models.Model):
  name = models.CharField(max_length=100, unique=True)