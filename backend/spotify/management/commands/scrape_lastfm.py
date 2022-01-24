import os
import time
from unicodedata import name
from django.http import response
import requests
from django.core.management.base import BaseCommand
from tqdm import tqdm


from spotify.models import Track, Tag

LASTFM_API_KEY = os.environ.get("LASTFM_API_KEY")
LASTFM_API_URL = os.environ.get("LASTFM_API_URL")

class Command(BaseCommand):
    help = "Scrapes lastfm data for previously scraped spotify tracks."


    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(
            "Successfully started LastFm scraping command."))
        
        # ToDo Move class to service class
        class LastFM:
            def __init__(self, url: str, api_key: str):
                self.url = url
                self.api_key = api_key

            def get_track_top_tag(self, track: Track):
                title = track.name
                artist = track.artists.split(',')[0]

                response = requests.get(
                    self.url, {'method': 'track.gettoptags', 'track': title, 'artist': artist, 'api_key': self.api_key, 'format': 'json'})
                if response.status_code != 200:
                    print(f"{response.status_code}: {response.content}")
                    return None

                json = response.json()
                try:
                    print(f"{len(json['toptags']['tag'])} Tags found for: {title} - {artist}")
                except KeyError:
                    print(f"Cant find/read top tag for: {title} - {artist}")
                    return None

                for tag in json['toptags']['tag']:
                    if tag['count'] > 2 and len(tag['name']) <= 100:
                        tag_obj = Tag(name=tag['name'], count=tag['count'], track=track)
                        tag_obj.save()
                print(f"Saved {len(json['toptags']['tag'])} for {track.name}")


        # track = Track.objects.get(id=2757)

        lastfm = LastFM(LASTFM_API_URL, LASTFM_API_KEY)
        tracks = Track.objects.filter(id__gt = 86132)

        for track in tqdm(tracks):
            lastfm.get_track_top_tag(track)
            #ToDo figure out API Limit
            time.sleep(0.15)
