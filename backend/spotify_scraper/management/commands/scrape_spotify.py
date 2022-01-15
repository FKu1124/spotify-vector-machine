from django.core.management.base import BaseCommand, CommandError
from spotify_scraper.services import scrape_tracks_by_artist_by_genre, scrape_genres


class Command(BaseCommand):
    help = 'Scrape the Tracks from the Spotify API'

    def handle(self, *args, **options):
        # scrape_genres()
        scrape_tracks_by_artist_by_genre()
        self.stdout.write(self.style.SUCCESS(
            'Successfully started spotify scraping command'))
