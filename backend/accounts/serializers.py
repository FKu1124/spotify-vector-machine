from rest_framework import serializers
from accounts.models import MoodVector


class MoodVectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodVector
        fields = ['name', 'user', 'start_profile', 'end_profile',
                  'image_path', 'x_start', 'y_start', 'x_end', 'y_end', 'length']
