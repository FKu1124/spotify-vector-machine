from django.core.management.base import BaseCommand

from spotify.services.recommender import create_song_vector_matrix


class Command(BaseCommand):
    help = "Scrapes lastfm data for previously scraped spotify tracks."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started recommender initialization."))

        create_song_vector_matrix()

        self.stdout.write(self.style.SUCCESS(
            "Finished recommender initialization."))
