import os
import time
from django.core.management.base import BaseCommand
from tqdm import tqdm

from spotify.services.lastfm_scraping import LastFM

from spotify.models import Track

LASTFM_API_KEY = os.environ.get("LASTFM_API_KEY")
LASTFM_API_URL = os.environ.get("LASTFM_API_URL")

class Command(BaseCommand):
    help = "Scrapes lastfm data for previously scraped spotify tracks."


    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started LastFm scraping command."))

        lastfm = LastFM(LASTFM_API_URL, LASTFM_API_KEY)
        tracks = Track.objects.all()
        
        for track in tqdm(tracks):
            lastfm.get_track_top_tag(track)
            #ToDo figure out API Limit
            time.sleep(0.15)
        
        self.stdout.write(self.style.SUCCESS(
            "Finished LastFm scraping command."))
