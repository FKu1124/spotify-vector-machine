playlists_dance = [
    '37i9dQZF1DX0BcQWzuB7ZO',
    '37i9dQZF1DX7ZUug1ANKRP',
    '37i9dQZF1DXbX3zSzB4MO0',
    '37i9dQZF1DXcfWvNFKxjDo',
    '37i9dQZF1DX4dyzvuaRJ0n',
]

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import json

# birdy_uri = 'spotify:artist:2WX2uTcsvV5OnS0inACecP'
spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


def get_playlists(playlists, saveJson):
    
    res = []
    
    for playlist in playlists:

        # Optimized request query
        results = spotify.playlist(playlist, fields="tracks.items(track.name,track.uri,track.artists(name))")["tracks"]["items"]

        for track in results:
            song = {
                'title': track["track"]["name"],
                'main_artist': track["track"]["artists"][0]["name"],
                'uri': track["track"]["uri"],
                'id': track["track"]["uri"].split(':')[2]
            }
            res.append(song)

    # print(res)
    if saveJson:
        with open('tracks.json', 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=4)
    else:
        print(res)

    return res


# currently gets features for the first 100 entries only
def get_features(ids, saveJson, filename = None):

    if not (filename is None):
        with open(filename) as f:
            d = json.load(f)
            # Get list of ids
            ids= [o["id"] for o in d]

    # ERROR somewhere in here - leads to 414
    # # Split list of uris in chunks of 100 uris (max amount for /audio-features endpoint)
    # chunks = [ids[x:x+10] for x in range(0, len(ids), 10)]

    # # Prepare for api request - join each chunk by a comma
    # request_chunks = [','.join(chunk) for chunk in chunks]


    request_chunks = [','.join(ids[:100])]

    features = spotify.audio_features(tracks=request_chunks)

    if saveJson:
        with open('features.json', 'w', encoding='utf-8') as f:
            json.dump(features, f, ensure_ascii=False, indent=4)
    else:
        print(features)

    # analysis = spotify.audio_analysis(ids[0])

    return features

if __name__ == "__main__":
    get_playlists(playlists_dance, True)
    get_features([], True, "tracks.json")