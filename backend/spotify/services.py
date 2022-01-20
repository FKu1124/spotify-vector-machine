import os
from typing import List
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm
from spotify.models import Genre, Artist, Album, Track, GenreArtist, GenreTrack

SPOTIPY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

PLAYLIST_LIMIT = 1
ARTIST_LIMIT = 1

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
        try:
            genre_obj = Genre(name=genre)
            genre_obj.save()
        except:
            continue


def scrape_top_playlists_by_genre() -> None:
    genres = Genre.objects.all()

    for genre in genres:
        try:
            search_response = spotify.search(q=genre.name,
                                             type="playlist",
                                             limit=PLAYLIST_LIMIT)
        except:
            continue

        for playlist in search_response["playlists"]["items"]:
            try:
                playlist_response = spotify.playlist(playlist["id"])
                tracks = playlist_response["tracks"]["items"]
                tracks = [track["track"] for track in tracks]
                save_tracks(tracks, genre)
            except:
                continue


def scrape_top_artists_by_genre() -> None:
    genres = Genre.objects.all()

    for genre in genres:
        try:
            search_response = spotify.search(q="genre:"+genre.name,
                                             type="artist",
                                             limit=PLAYLIST_LIMIT)

            for artist in search_response["artists"]["items"]:
                try:
                    artist__albums_response = spotify.artist_albums(
                        artist["id"])
                    albums = artist__albums_response["items"]
                    for album in albums:
                        try:
                            album_tracks_repsonse = spotify.album_tracks(
                                album["id"])
                            album_tracks_repsonse = album_tracks_repsonse["items"]
                            tracks = []
                            for track in album_tracks_repsonse:
                                tracks.append(spotify.track(track["id"]))
                            save_tracks(tracks, genre)
                        except:
                            continue
                except:
                    continue
        except:
            continue


def save_tracks(tracks: List, base_genre: Genre) -> None:
    for track in tracks:
        try:
            created = False
            try:
                track_obj = Track.objects.get(spotify_id=track["id"])
            except:
                track_obj = Track(name=track["name"],
                                  spotify_id=track["id"])
                created = True

            track_obj.popularity = track["popularity"]

            if created:

                track_audio_features = spotify.audio_features(
                    track_obj.spotify_id)[0]
                track_obj.name = name = track["name"]
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

                # add artists to track
                for artist in track["artists"]:
                    try:
                        artist_obj = get_or_create_artist(
                            artist["id"], base_genre)
                        track_obj.artists.add(artist_obj)

                        # add genre to track
                        for genre in artist_obj.genres.all():
                            track_obj.genres.add(genre)

                            if genre.name == base_genre.name:
                                genre_track_obj = GenreTrack.objects.get(genre=base_genre.id,
                                                                         track=track_obj.id)
                                genre_track_obj.base_genre = True
                                genre_track_obj.save()
                    except:
                        continue

                # add album to track
                try:
                    album_obj = get_or_create_ablum(
                        track["album"]["id"], base_genre)
                    track_obj.album = album_obj
                except:
                    pass

            track_obj.save()

        except:
            continue


def get_or_create_artist(artist_spotify_id: str, base_genre: Genre):
    try:
        artist_obj, created = Artist.objects.get_or_create(
            spotify_id=artist_spotify_id)

        artist_response = spotify.artist(artist_obj.spotify_id)
        artist_obj.popularity = artist_response["popularity"]
        artist_obj.followers = artist_response["followers"]["total"]

        if created:
            artist_obj.save()
            for genre in artist_response["genres"]:

                genre_obj, created = Genre.objects.get_or_create(name=genre)
                if created:
                    genre_obj.save()

                artist_obj.genres.add(genre_obj)

                # set base genre
                if genre == base_genre.name:
                    genre_artist_obj = GenreArtist.objects.get(
                        genre=genre_obj.id, artist=artist_obj.id)
                    genre_artist_obj.base_genre = True
                    genre_artist_obj.save()

        artist_obj.save()
    except:
        return None

    return artist_obj


def get_or_create_ablum(album_spotify_id: str, base_genre: Genre):
    try:
        album_response = spotify.album(album_spotify_id)

        created = False
        try:
            album_obj = Album.objects.get(spotify_id=album_response["id"])
        except:
            album_obj = Album(spotify_id=album_response["id"])
            created = True

        album_obj.popularity = album_response["popularity"]

        if created:
            album_obj.name = album_response["name"]
            album_obj.spotify_id = album_response["id"]
            album_obj.album_type = album_response["album_type"]
            album_obj.total_tracks = album_response["total_tracks"]
            album_obj.popularity = album_response["popularity"]
            album_obj.release_date = album_response["release_date"]
            album_obj.save()

            for artist in album_response["artists"]:
                artist_obj = get_or_create_artist(artist["id"], base_genre)
                album_obj.artists.add(artist_obj)

        album_obj.save()

        return album_obj

    except:
        return None


scrape_genres()

scrape_top_playlists_by_genre()
scrape_top_artists_by_genre()
