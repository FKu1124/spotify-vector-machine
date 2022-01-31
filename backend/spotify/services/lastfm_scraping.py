import requests
from spotify.models import Track, Tag

class LastFM:
    def __init__(self, url: str, api_key: str, minimum_tag_count = 5):
        self.url = url
        self.api_key = api_key
        self.minimum_tag_count = minimum_tag_count

    def get_track_top_tag(self, track: Track) -> None:
        title = track.name
        artist = track.artists.split(',')[0]

        response = requests.get(
            self.url, {'method': 'track.gettoptags', 'track': title, 'artist': artist, 'autocorrect': 1, 'api_key': self.api_key, 'format': 'json'})
        if response.status_code != 200:
            print(f"ERROR {response.status_code}: {response.content}")
            return None

        json = response.json()
        
        try:
            for tag in json['toptags']['tag']:
                if tag['count'] > self.minimum_tag_count and len(tag['name']) <= 100:
                    tag_obj = Tag(name=tag['name'],
                                count=tag['count'], track=track)
                    tag_obj.save()

        except KeyError:
            print(f"Cant find/read top tag for: {title} - {artist}")
            return None