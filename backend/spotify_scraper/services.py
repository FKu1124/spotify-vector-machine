import os
from typing import List

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm

from .models import Genre, Track

# SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
# SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')

SPOTIPY_CLIENT_ID = ""
SPOTIPY_CLIENT_SECRET = ""

spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(
        client_id=SPOTIPY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET
    )
)


def scrape_genres() -> None:
    "Requests all recommended genres and saves them to the database"
    genres = spotify.recommendation_genre_seeds()['genres']
    for genre in genres:
        genre_obj = Genre(name=genre)
        genre_obj.save()


def scrape_tracks_by_artist_by_genre() -> None:
    genres = Genre.objects.all()

    # Start by downloading top artists for all genres
    artists = {}

    for genre in tqdm(genres, desc="genres"):
        artist_response = spotify.search(
        q="genre: " + genre.name, type="artist", limit=2)

        for artist in artist_response["artists"]["items"]:
            artists[artist["id"]] = {
                "id": artist["id"],
                "name": artist["name"],
                "popularity": artist["popularity"],
                "followers": artist["followers"]["total"],
                "baseGenre": genre,
                "genres": artist["genres"],
            }