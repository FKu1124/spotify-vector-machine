from django.core.management.base import BaseCommand
from spotify.services.spotify_scraping import scrape_genres, scrape_top_artists_by_genre, scrape_top_playlists_by_genre


class Command(BaseCommand):
    help = "Scrapes Spotify and stores Genres, Artists, Albums and Tracks into DB."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started Spotify scraping command."))

        self.stdout.write("Scraping Genres...")
        scrape_genres()
        self.stdout.write("Finishes downloading seed Genres.")

        self.stdout.write("Scraping the top Playlists by Genres...")
        scrape_top_playlists_by_genre()
        self.stdout.write("Finished scraping the top Playlists by Genres.")

        self.stdout.write("Scraping the top Artists by Genres...")
        scrape_top_artists_by_genre()
        self.stdout.write("Finished scraping the top Artists by Genres.")

        self.stdout.write(self.style.SUCCESS(
            "Successfully finished Spotify scraping command"))
