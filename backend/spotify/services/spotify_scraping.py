import os
from typing import List
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm
from spotify.models import Genre, Track
from requests.exceptions import ReadTimeout
from django.db.utils import DataError

SPOTIPY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

PLAYLIST_LIMIT = 10
ARTIST_LIMIT = 40

spotify = spotipy.Spotify(
    requests_timeout=7,
    status_retries=5,
    client_credentials_manager=SpotifyClientCredentials(
        client_id=SPOTIPY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET
    )
)

# docker exec -it postgres_container sh
# psql -U djangoUser djangodb
# \dt
# SELECT * FROM spotify_genre;


def scrape_genres() -> None:
    genres = spotify.recommendation_genre_seeds()["genres"]
    for genre in genres:
        try:
            genre_obj = Genre.objects.get_or_create(name=genre, seed_genre=True)
            genre_obj.save()
        except:
            continue


def scrape_top_playlists_by_genre() -> None:
    genres = Genre.objects.filter(seed_genre=True)

    for genre in tqdm(genres):
        search_response = spotify.search(q=genre.name,
                                         type="playlist",
                                         limit=PLAYLIST_LIMIT,
                                         market="DE")

        for playlist in search_response["playlists"]["items"]:
            try:
                playlist_response = spotify.playlist(playlist["id"])
            except ReadTimeout:
                print("Spotify playlist request timed out multiple times, continuing....")
                continue

            tracks = playlist_response["tracks"]["items"]
            tracks = [track["track"] for track in tracks if track is not None]
            save_tracks(tracks, genre)


def scrape_top_artists_by_genre() -> None:
    genres = Genre.objects.filter(seed_genre=True)

    for genre in tqdm(genres):
        search_response = spotify.search(q="genre:"+genre.name,
                                         type="artist",
                                         limit=ARTIST_LIMIT,
                                         market="DE")

        for artist in search_response["artists"]["items"]:
            try:
                tracks = spotify.artist_top_tracks(artist["id"], country="DE")['tracks']
            except ReadTimeout:
                print("Spotify Artist top tracks request timed out multiple times, continuing....")
                continue

            save_tracks(tracks, genre)


def save_tracks(tracks: List, base_genre: Genre) -> None:
    for track in tracks:
        if track is None:
            continue

        updated = Track.objects.filter(spotify_id=track["id"]).update(
            popularity=track["popularity"])

        if updated == 1:
            continue
        else:
            track_obj = Track(spotify_id=track["id"])
            track_obj.name = track["name"]
            track_obj.album = track["album"]["name"]
            
            try:
                audio_feature_response = spotify.audio_features(
                    track["id"])
                track_audio_features = audio_feature_response[0]
            except ReadTimeout:
                print("Spotify audio feature request timed out multiple times, continuing....")
                continue
            except TypeError:
                print(f"Error fetching audio feature for track {track['id']}")
                continue
            
            if track_audio_features is None:
                continue

            track_obj.popularity = track["popularity"]
            track_obj.danceability = track_audio_features["danceability"]
            track_obj.loudness = track_audio_features["loudness"]
            track_obj.speechiness = track_audio_features["speechiness"]
            track_obj.acousticness = track_audio_features["acousticness"]
            track_obj.instrumentalness = track_audio_features["instrumentalness"]
            track_obj.liveness = track_audio_features["liveness"]
            track_obj.valence = track_audio_features["valence"]
            track_obj.energy = track_audio_features["energy"]
            track_obj.tempo = track_audio_features["tempo"]
            track_obj.duration = track_audio_features["duration_ms"]
            track_obj.key = track_audio_features["key"]
            track_obj.mode = track_audio_features["mode"]
            track_obj.time_signature = track_audio_features["time_signature"]

            # add artists to track
            artist_strings = []
            genre_strings = []

            for artist in track["artists"]:
                artist_strings.append(artist["name"])

                try:
                    artist_obj = spotify.artist(artist["id"])
                except ReadTimeout:
                    print(
                        "Spotify artist genre request timed out multiple times, continuing....")
                    continue

                for genre in artist_obj["genres"]:
                    genre_strings.append(genre.strip())
            
            track_obj.genres = ','.join(genre_strings)
            track_obj.artists = ','.join(artist_strings)
            
            try:
                track_obj.save()
            except DataError:
                # Value too long for CharField
                continue


# def get_or_create_artist(artist_spotify_id: str, name: str, base_genre: Genre):
#     artist_obj, created = Artist.objects.get_or_create(
#         spotify_id=artist_spotify_id)

#     if created:
#         try:
#             artist_response = spotify.artist(artist_obj.spotify_id)
#         except ReadTimeout:
#             print("Spotify artist request timed out multiple times")
#             return None

#         artist_obj.name = name
#         artist_obj.popularity = artist_response["popularity"]
#         artist_obj.followers = artist_response["followers"]["total"]

#         artist_obj.save()

#         for genre in artist_response["genres"]:
#             genre_name = genre.strip()
#             genre_name = genre_name.replace("-", " ")
#             genre_obj, created = Genre.objects.get_or_create(name=genre)
#             if created:
#                 genre_obj.save()

#             artist_obj.genres.add(genre_obj)

#         artist_obj.save()

#         # set base genre
#     genre_artist_obj, created = GenreArtist.objects.get_or_create(genre=base_genre,
#                                                                   artist=artist_obj)
#     genre_artist_obj.base_genre = True
#     genre_artist_obj.save()

#     artist_obj.save()

#     return artist_obj


# def get_or_create_album(album_spotify_id: str, base_genre: Genre):
#     try:
#         album_response = spotify.album(album_spotify_id)

#         created = False
#         try:
#             album_obj = Album.objects.get(spotify_id=album_response["id"])
#         except:
#             album_obj = Album(spotify_id=album_response["id"])
#             created = True

#         album_obj.popularity = album_response["popularity"]

#         if created:
#             album_obj.name = album_response["name"]
#             album_obj.spotify_id = album_response["id"]
#             album_obj.album_type = album_response["album_type"]
#             album_obj.total_tracks = album_response["total_tracks"]
#             album_obj.popularity = album_response["popularity"]
#             album_obj.release_date = album_response["release_date"]
#             album_obj.save()

#             for artist in album_response["artists"]:
#                 artist_obj = get_or_create_artist(artist["id"],
#                                                   artist["name"],
#                                                   base_genre)
#                 album_obj.artists.add(artist_obj)

#         album_obj.save()

#         return album_obj

#     except:
#         return None
