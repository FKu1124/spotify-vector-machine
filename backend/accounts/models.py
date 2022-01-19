from django.db import models
from django.conf import settings



# Create your models here.

class MoodVector(models.Model):
    name = models.CharField(max_length=200)
    image_path = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    x_start = models.IntegerField()
    y_start = models.IntegerField()
    x_end = models.IntegerField()
    y_end = models.IntegerField