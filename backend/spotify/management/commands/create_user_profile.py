from django.core.management.base import BaseCommand
import os
from spotify.services.user_profiles import create_user_profile
from django.contrib.auth.models import User
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


SPOTIPY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')

scope = "user-read-email user-read-private user-top-read user-read-recently-played user-read-playback-position user-library-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        help = "Scrapes lastfm data for previously scraped spotify tracks."
        
        cache_handler = DjangoSessionCacheHandler(request=request)
        auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret,
                                    redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)

        auth_manager.get_access_token(self.request.GET.get("code"))
        spotify = spotipy.Spotify(auth_manager=auth_manager)

        user = User.objects.first()

        self.stdout.write(self.style.SUCCESS(
            "Successfully started user profile initialization."))

        create_user_profile(user, spotify)

        self.stdout.write(self.style.SUCCESS(
            "Finished user profile initialization."))
