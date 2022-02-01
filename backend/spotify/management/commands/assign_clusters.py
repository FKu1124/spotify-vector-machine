from django.core.management.base import BaseCommand
from tqdm import tqdm
import pandas as pd

from spotify.models import Track


class Command(BaseCommand):
    help = "Assigns cluster to tracks."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started Cluster Assignment command."))

        genres_df = pd.read_csv('storage/enao.csv')
        genres_df = genres_df[['genre', 'cluster']]
        genres_dict = dict(zip(genres_df.genre, genres_df.cluster))

        tracks = Track.objects.filter(
            name__isnull=False, genres__isnull=False).exclude(genres__exact='')

        for track in tqdm(tracks):
            genres = track.genres
            genres = genres.split(',')

            cluster_count = {}
            for genre in genres:
                cluster = genres_dict[genre]
                if not cluster in cluster_count:
                    cluster_count[cluster] = 1
                else:
                    cluster_count[cluster] = cluster_count[cluster] + 1

            sorted_cluster = sorted(
                cluster_count, key=cluster_count.get, reverse=True)
            # ToDo handle equal count case
            track.cluster = sorted_cluster[0]
            track.save()

        self.stdout.write(self.style.SUCCESS(
            "Finished Cluster Assignment command."))
