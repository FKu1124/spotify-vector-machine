import os
from typing import List
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm
from spotify.models import Genre, Artist, Album, Track, GenreArtist, GenreTrack
from spotifyAPI.json_parser import load_json, pretty_print_json

SPOTIPY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

PLAYLIST_LIMIT = 5

spotify = spotipy.Spotify(
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
        genre_obj = Genre(name=genre)
        genre_obj.save()


def scrape_genre_top_playlists() -> None:
    genres = Genre.objects.all()

    for genre in genres:
        search_response = spotify.search(q=genre.name,
                                         type="playlist",
                                         limit=PLAYLIST_LIMIT)

        for playlist in search_response["playlists"]["items"]:
            playlist_response = spotify.playlist(playlist["id"])
            tracks = playlist_response["tracks"]["items"]
            save_tracks(tracks, genre)
            break


def save_tracks(tracks: List, base_genre: Genre) -> None:
    for track in tracks:
        print(base_genre)
        track = track["track"]
        # track_obj, created = Track.objects.get_or_create(name=track["name"],
        #                                                  spotify_id=track["id"])

        try:
            track_obj = Track.objects.get(name=track["name"],
                                          spotify_id=track["id"])
            created = False
        except:
            track_obj = Track(name=track["name"],
                              spotify_id=track["id"])
            created = True

        track_obj.popularity = track["popularity"]

        if created:

            track_audio_features = spotify.audio_features(
                track_obj.spotify_id)[0]
            track_obj.danceability = track_audio_features["danceability"]
            track_obj.loudness = track_audio_features["loudness"]
            track_obj.speechiness = track_audio_features["speechiness"]
            track_obj.acousticness = track_audio_features["acousticness"]
            track_obj.instrumentalness = track_audio_features["instrumentalness"]
            track_obj.liveness = track_audio_features["liveness"]
            track_obj.valence = track_audio_features["valence"]
            track_obj.energy = track_audio_features["energy"]
            track_obj.arousal = track_audio_features["energy"]
            track_obj.tempo = track_audio_features["tempo"]
            track_obj.duration = track_audio_features["duration_ms"]
            track_obj.key = track_audio_features["key"]
            track_obj.mode = track_audio_features["mode"]
            track_obj.time_signature = track_audio_features["time_signature"]

            track_obj.save()

            add_artists_to_track(track_obj, track["artists"], base_genre)
            add_genre_to_track(track_obj, base_genre)
            add_album_to_track(track_obj, track["album"]["id"])

    track_obj.save()


def add_artists_to_track(track: Track, artists: dict, base_genre: Genre) -> None:
    for artist in artists:
        artist_obj, created = Artist.objects.get_or_create(name=artist["name"],
                                                           spotify_id=artist["id"])

        if created:
            artist_response = spotify.artist(artist_obj.spotify_id)
            artist_obj.popularity = artist_response["popularity"]
            artist_obj.followers = artist_response["followers"]["total"]

            artist_obj.save()
            for genre in artist_response["genres"]:

                genre_obj, created = Genre.objects.get_or_create(name=genre)
                if created:
                    genre_obj.save()

                artist_obj.genres.add(genre_obj)

                # set base genre
                if genre == base_genre.name:
                    genre_artist_obj = GenreArtist.objects.get(
                        genre=genre_obj, artist=artist_obj)
                    genre_artist_obj.update(base_genre=True)

        artist_obj.save()

        track.artists.add(artist_obj)


def add_genre_to_track(track_obj: Track, base_genre: Genre) -> None:
    for artist in track_obj.artists.all():
        for genre in artist.genres.all():
            track_obj.genres.add(genre)

            if genre.name == base_genre.name:
                base_genre_obj = Genre.objects.get(name=base_genre)
                genre_track_obj = GenreTrack.objects.get(genre=base_genre_obj,
                                                         track=track_obj)
                genre_track_obj.update(base_genre=True)


def add_album_to_track(track_obj: Track, album_id: str) -> None:
    album = spotify.album(album_id)

    album_obj, created = Album.objects.update_or_create(name=album["name"],
                                                        spotify_id=album_id,
                                                        album_type=album["album_type"],
                                                        total_tracks=album["total_tracks"],
                                                        popularity=album["popularity"],
                                                        release_date=album["release_date"])

    if created:
        album_obj.save()

    for artist in album["artists"]:
        artist_obj = Artist.objects.get(spotify_id=artist["id"])
        album_obj.artists.add(artist_obj)

    album_obj.save()


# scrape_genres()

scrape_genre_top_playlists()
