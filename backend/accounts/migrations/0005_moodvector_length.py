# Generated by Django 4.0.1 on 2022-01-29 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_moodvector_y_end'),
    ]

    operations = [
        migrations.AddField(
            model_name='moodvector',
            name='length',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]