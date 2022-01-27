import os
from typing import List
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from tqdm import tqdm
import pandas as pd
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
            genre_obj = Genre(name=genre, seed_genre=True)
            genre_obj.save()
        except:
            continue


def scrape_top_playlists_by_genre() -> None:
    genres = Genre.objects.filter(seed_genre=True)

    for genre in genres:
        search_response = spotify.search(q=genre.name,
                                         type="playlist",
                                         limit=PLAYLIST_LIMIT)

        for playlist in search_response["playlists"]["items"]:
            playlist_response = spotify.playlist(playlist["id"])
            tracks = playlist_response["tracks"]["items"]
            tracks = [track["track"] for track in tracks]
            save_tracks(tracks, genre)


def scrape_top_artists_by_genre() -> None:
    genres = Genre.objects.filter(seed_genre=True)

    for genre in genres:
        search_response = spotify.search(q="genre:"+genre.name,
                                         type="artist",
                                         limit=ARTIST_LIMIT)

        for artist in search_response["artists"]["items"]:
            artist_albums_response = spotify.artist_albums(
                artist["id"])
            albums = artist_albums_response["items"]
            for album in albums:
                album_tracks_repsonse = spotify.album_tracks(
                    album["id"])
                album_tracks_repsonse = album_tracks_repsonse["items"]
                tracks = []
                for track in album_tracks_repsonse:
                    tracks.append(spotify.track(track["id"]))
                save_tracks(tracks, genre)


def save_tracks(tracks: List, base_genre: Genre) -> None:
    for track in tracks:
        try:
            created = False
            try:
                track_obj = Track.objects.get(spotify_id=track["id"])
            except:
                track_obj = Track(spotify_id=track["id"])
                created = True

            track_obj.popularity = track["popularity"]

            if created:

                track_audio_features = spotify.audio_features(
                    track_obj.spotify_id)[0]
                track_obj.name = track["name"]
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
                    artist_obj = get_or_create_artist(artist["id"],
                                                      artist["name"],
                                                      base_genre)
                    track_obj.artists.add(artist_obj)

                    # add genre to track
                    for genre in artist_obj.genres.all():
                        track_obj.genres.add(genre)

                track_obj.save()

                genre_track_obj, created = GenreTrack.objects.get_or_create(genre=base_genre,
                                                                            track=track_obj)
                genre_track_obj.base_genre = True
                genre_track_obj.save()

                # add album to track
                try:
                    album_obj = get_or_create_album(track["album"]["id"],
                                                    base_genre)
                    track_obj.album = album_obj
                except:
                    pass

            track_obj.save()
        except:
            print(f"Something went wrong with song id: {track['id']}")
            pass


def get_or_create_artist(artist_spotify_id: str, name: str, base_genre: Genre):
    artist_obj, created = Artist.objects.get_or_create(
        spotify_id=artist_spotify_id)

    if created:
        artist_response = spotify.artist(artist_obj.spotify_id)
        artist_obj.name = name
        artist_obj.popularity = artist_response["popularity"]
        artist_obj.followers = artist_response["followers"]["total"]

        artist_obj.save()

        for genre in artist_response["genres"]:
            genre_name = genre.strip()
            genre_name = genre_name.replace("-", " ")
            genre_obj, created = Genre.objects.get_or_create(name=genre)
            if created:
                genre_obj.save()

            artist_obj.genres.add(genre_obj)

        artist_obj.save()

        # set base genre
    genre_artist_obj, created = GenreArtist.objects.get_or_create(genre=base_genre,
                                                                  artist=artist_obj)
    genre_artist_obj.base_genre = True
    genre_artist_obj.save()

    artist_obj.save()

    return artist_obj


def get_or_create_album(album_spotify_id: str, base_genre: Genre):
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
                artist_obj = get_or_create_artist(artist["id"],
                                                  artist["name"],
                                                  base_genre)
                album_obj.artists.add(artist_obj)

        album_obj.save()

        return album_obj

    except:
        return None


def save_tracks_as_csv():
    tracks = Track.objects.all()

    headings = ["danceability",
                "loudness",
                "speechiness",
                "acousticness",
                "instrumentalness",
                "liveness",
                "valence",
                "energy",
                "arousal",
                "tempo",
                "duration",
                "key",
                "mode",
                "time_signature",
                "popularity",
                "genre"]

    tracks_list = []

    for track in tracks:
        track_list = []
        track_list.append(track.danceability)
        track_list.append(track.loudness)
        track_list.append(track.speechiness)
        track_list.append(track.acousticness)
        track_list.append(track.instrumentalness)
        track_list.append(track.liveness)
        track_list.append(track.valence)
        track_list.append(track.energy)
        track_list.append(track.arousal)
        track_list.append(track.tempo)
        track_list.append(track.duration)
        track_list.append(track.key)
        track_list.append(track.mode)
        track_list.append(track.time_signature)
        track_list.append(track.popularity)

        genre = track.genres.filter(seed_genre=True)
        if len(genre) == 0:
            continue
        track_list.append(genre[0].name)

        tracks_list.append(track_list)

    df = pd.DataFrame(tracks_list, columns=headings)

    df.to_csv("tracks.csv")
