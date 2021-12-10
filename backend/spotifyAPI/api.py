import json
from typing import List
import os

from tqdm import tqdm
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

FILE_DIR = os.path.dirname(__file__)
SPOTIPY_CLIENT_ID = "a004571f10214187b0a96a9a7dedacb1"
SPOTIPY_CLIENT_SECRET = "02fe6a70e4ed4486b625d6563a4ffcd1"
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID, client_secret=SPOTIPY_CLIENT_SECRET))

def search_for_artists_albums_ids(artists: dict) -> List[str]:
    album_ids = []
    for artist in tqdm(artists, desc="artists"):
        artist_albums = spotify.artist_albums(artists[artist]["id"])
        artist_albums = artist_albums["items"]
        artist_albmum_ids = [artist_album["id"] for artist_album in artist_albums]
        artists[artist]["album_ids"] = artist_albmum_ids
        album_ids += artist_albmum_ids

    with open(os.path.join(FILE_DIR, "artists.json"), "w") as f:
            json.dump(artists, f)

    return album_ids

def search_for_albums_songs(album_ids: List[str], track_information: dict) -> dict:
    not_found_album_ids = []
    for album_id in album_ids:
        try:
            tracks = spotify.album_tracks(album_id)
            tracks = tracks["items"]
            for track in tracks:
                track_information[track["id"]] = {"id": track["id"],
                                                "name": track["name"],
                                                "album_id": album_id,
                                                "artists": track["artists"],
                                                }
        except:
            print(f"Could not find abum: {album_id}")
            not_found_album_ids.append(album_id)


    return track_information, not_found_album_ids


def search_for_track_features_by_artists(artist: dict):
    track_information = {}

    print("Getting generell track information from artists.\n")
    
    # If you just want to get some tracks to toy around with for now uncomment all below for an early break
    # i = 0
    for artist in tqdm(artists, desc="artists"):
        track_information, _ = search_for_albums_songs(artists[artist]["album_ids"], track_information)

        # if i == 7:
        #     break
        # i += 1    

    track_ids = [track_information[track]["id"] for track in track_information]
    tracks_audio_featues, not_found_track_ids = search_for_tracks_audio_features(track_ids)

    for track in track_information:
        if track in not_found_track_ids:
            continue
        track_information[track] = merge_dicts(track_information[track], tracks_audio_featues[track])

    with open(os.path.join(FILE_DIR, "tracks.json"), "w") as f:
        json.dump(track_information, f)

def merge_dicts(dict1, dict2) -> dict:
    new_dict = {}
    for key in dict1:
        new_dict[key] = dict1[key]
    
    for key in dict2:
        new_dict[key] = dict2[key]

    return new_dict

def search_for_tracks_audio_features(track_ids: List[str]) -> dict:
    tracks_audio_featues = {}
    not_found_track_ids = []

    print("Getting track features.\n")
    for track_id in tqdm(track_ids, desc="tracks"):
        try:
            audio_features = spotify.audio_features(track_id)[0]
            tracks_audio_featues[audio_features["id"]] = {"id": audio_features["id"],
                                                        "danceability": audio_features["danceability"],
                                                        "energy": audio_features["energy"],
                                                        "key": audio_features["key"],
                                                        "loudness": audio_features["loudness"],
                                                        "mode": audio_features["mode"],
                                                        "speechiness": audio_features["speechiness"],
                                                        "acousticness": audio_features["acousticness"],
                                                        "instrumentalness": audio_features["instrumentalness"],
                                                        "liveness": audio_features["liveness"],
                                                        "valence": audio_features["valence"],
                                                        "tempo": audio_features["tempo"],
                                                        "duration_ms": audio_features["duration_ms"],
                                                        "time_signature": audio_features["time_signature"],
                                                        }
        except:
            print(f"Could not find track: {track_id}")
            not_found_track_ids.append(track_id)

    return tracks_audio_featues, not_found_track_ids


def get_initial_genres(save_genres = True):
    genres = spotify.recommendation_genre_seeds()
    if save_genres:
        with open(os.path.join(FILE_DIR, "genres.json"), "w") as f:
            json.dump(genres, f)

def search_artists_by_genre(genre: str, artists: dict) -> List[dict]:
    artist_response = spotify.search(q="genre: " + genre, type="artist", limit=5)
    for artist in artist_response["artists"]["items"]:
        artists[artist["id"]] = {"id": artist["id"],
                                 "name": artist["name"],
                                 "popularity": artist["popularity"],
                                 "followers": artist["followers"]["total"],
                                 "baseGenre": genre,
                                 "genres": artist["genres"],
                                }

    return artists

def search_artists_by_genres(genres: List[str]):
    artists = {}
    for genre in tqdm(genres, desc="genres"):
        artists = search_artists_by_genre(genre, artists)
    
    with open(os.path.join(FILE_DIR, "artists.json"), "w") as f:
        json.dump(artists, f)

def extract_all_gernes_from_artist(artists: dict):
    genres = []
    for artist in artists:
        genres += artists[artist]["genres"]
    genres = list(dict.fromkeys(genres))
    print(f"Extracted {len(genres)} genres.")
    genres = {"genres": genres}

    with open(os.path.join(FILE_DIR, "all_genres.json"), "w") as f:
        json.dump(genres, f)


if __name__ == "__main__":
    print("Getting initail genres from Spotify.\n")
    get_initial_genres()

    print("Searching artists by a list of genres.\n")
    with open(os.path.join(FILE_DIR, "genres.json"), "r") as f:
        genres = json.load(f)
    search_artists_by_genres(genres["genres"])

    print("Searching for albums of artists and saving it to the artist.\n")
    with open(os.path.join(FILE_DIR, "artists.json"), "r") as f:
        artists = json.load(f)
    search_for_artists_albums_ids(artists)

    print("Extracting all genres an sub-genres from artists.\n")
    extract_all_gernes_from_artist(artists)

    print("Search for all track features for all artists albums.\n")
    search_for_track_features_by_artists(artists)

    with open(os.path.join(FILE_DIR, "tracks.json"), "r") as f:
        artists = json.load(f)
    print(artists)
