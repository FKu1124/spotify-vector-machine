from django.db import models
from django.conf import settings



# Create your models here.

class MoodVector(models.Model):
    name = models.CharField(max_length=200)
    image_path = models.CharField(max_length=200)
    playlist_url = models.CharField(max_length=200, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    x_start = models.FloatField()
    y_start = models.FloatField()
    x_end = models.FloatField()
    y_end = models.FloatField()