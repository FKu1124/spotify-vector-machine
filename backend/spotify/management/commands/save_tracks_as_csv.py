from django.core.management.base import BaseCommand
import pandas as pd
from spotify.models import Track, Genre
from tqdm import tqdm


class Command(BaseCommand):
    help = "Saves all Tracks in a CSV file."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started Saving Tracks as csv."))

        self._save_tracks()

        self.stdout.write(self.style.SUCCESS(
            "Finished Saving Tracks as csv."))

    def _save_tracks(self) -> None:
        track_objects = Track.objects.all()
        all_genres = [genre.name for genre in Genre.objects.all()]

        column_names = ["spotify_id",
                        "name",
                        "genre",
                        "danceability",
                        "loudness",
                        "speechiness",
                        "acousticness",
                        "instrumentalness",
                        "liveness",
                        "valence",
                        "energy",
                        "tempo",
                        "duration",
                        "key",
                        "mode",
                        "time_signature",
                        "popularity"]

        track_list = []

        for track in tqdm(track_objects):
            genres = track.genres.split(",")
            genre = "undefined"
            for g in genres:
                if g in all_genres:
                    genre = g
                    break

            track_list.append([track.spotify_id,
                               track.name,
                               genre,
                               track.danceability,
                               track.loudness,
                               track.speechiness,
                               track.acousticness,
                               track.instrumentalness,
                               track.liveness,
                               track.valence,
                               track.energy,
                               track.tempo,
                               track.duration,
                               track.key,
                               track.mode,
                               track.time_signature,
                               track.popularity])

        # track_list = [column_names, track_list]

        import pathlib
        print(pathlib.Path(__file__).parent.resolve())

        track_df = pd.DataFrame(track_list)
        import os
        track_df.to_csv(os.path.join("tracks.csv"),
                        sep=",", index=False, header=column_names)
