# Generated by Django 4.0.1 on 2022-02-02 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_moodvector_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='moodvector',
            name='end_profile',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='moodvector',
            name='start_profile',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
