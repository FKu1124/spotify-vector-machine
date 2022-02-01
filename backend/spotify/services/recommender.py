import os

from django.contrib.auth.models import User
import numpy as np
import scipy.sparse
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine

from accounts.models import MoodVector
from spotipy import Spotify

# Adjustable weights for the different feature vector components
W_ARTIST = 1
W_TITLE = 1
W_GENRE = 1
W_SOUND = 1
W_TAGS = 1

# DB Connection to directly load in dataframe
def get_db_connection():
    db_name = os.environ.get('POSTGRES_NAME')
    db_user = os.environ.get('POSTGRES_USER')
    db_pass = os.environ.get('POSTGRES_PASSWORD')
    db_host = os.environ.get('POSTGRES_HOST')
    db_port = os.environ.get('POSTGRES_PORT')

    engine = create_engine(
        f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}")

    return engine


def _preprocess_tags(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop('id', axis=1)
    df.dropna()
    df[['name', 'count']] = df[['name', 'count']].astype(str)

    # Make tag name lowercase and remove spaces
    df['name'] = df['name'].apply(
        lambda x: x.lower().replace(" ", "").replace(":", ""))

    # Join Tag Names with tag counts and group for each track
    df['name'] = df['name'] + ':' + df['count']
    df = df.drop('count', axis=1)
    df = df.groupby('track_id').agg(lambda x: ' '.join(list(x)))

    # Rename tag:count column
    df = df.rename(columns={"name": "tags"})

    return df


def _generate_single_feature_string(feature_str: str, max: int = 50, weight: int = 1) -> str:
    feature_list = []
    count = 0

    for feature in str(feature_str).split(','):
        if count < max:
            feature_list.append(feature.lower().replace(" ", ""))
        else:
            break
        count += 1

    return ' '.join(feature_list)


def _generate_tags_feature_string(tags_str, max: int = 50, weight: int = 1) -> str:
    if tags_str == 'nan':
        return ''

    tag_count_list = tags_str.split(' ')
    tag_str_list = []
    i = 0

    for tag_count in tag_count_list:
        [tag, count] = tag_count.split(':')

        if i > max:
            break
        i = i+1

        # Top Tag weight
        if int(count) > 75:
            w_tag = 3
        # Mediocore Tag weight
        elif int(count) > 50:
            w_tag = 2
        # Default Tag weight
        elif int(count) > 25 or len(tag_count_list) < 5:
            w_tag = 1
        # Dismiss if tag count <= 25 for less than 5 tags
        else:
            continue

        tag_str_list.append(' '.join([tag] * w_tag))

    tag_feature_string = ' '.join(tag_str_list)
    return tag_feature_string


def _generate_audio_feature_string(feature_str: str, feature_value: float, value_range: list = [.25, .5, .75], weight: int = 1) -> str:
    if feature_value > value_range[2]:
        w_feature = 3
    elif feature_value > value_range[1]:
        w_feature = 2
    elif feature_value > value_range[0]:
        w_feature = 1
    # Dismiss if audio feature is in lowest quantile
    else:
        return ''

    return ' '.join([feature_str] * w_feature)


def _extract_track_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop(['key', 'mode', 'album', 'duration',
                 'created_at', 'updated_at'], axis=1)

    feature_list = ['artists', 'genres', 'tags']
    sound_attr_list = ['loudness', 'tempo', 'energy', 'acousticness',
                       'danceability', 'instrumentalness', 'liveness', 'speechiness', 'valence']
    full_feature_list = feature_list + sound_attr_list

    df[feature_list] = df[feature_list].astype(str)
    df[sound_attr_list] = df[sound_attr_list].astype(float)

    df['artists'] = df.apply(
        lambda x: _generate_single_feature_string(x.artists, weight=W_ARTIST), axis=1)
    df['genres'] = df.apply(
        lambda x: _generate_single_feature_string(x.genres, weight=W_GENRE), axis=1)
    # df['name'] = df.apply(
    #     lambda x: _generate_single_feature_string(x.name, weight=W_GENRE), axis=1)
    df['tags'] = df.apply(
        lambda x: _generate_tags_feature_string(x.tags, 10, W_TAGS), axis=1)

    # Audio Feature extracting
    scale_loudness = df['loudness'].quantile([.25, .5, .75]).tolist()
    scale_tempo = df['tempo'].quantile([.25, .5, .75]).tolist()

    df['loudness'] = df.apply(
        lambda x: _generate_audio_feature_string('loudness', x.loudness, scale_loudness, W_SOUND), axis=1)
    df['tempo'] = df.apply(
        lambda x: _generate_audio_feature_string('tempo', x.tempo, scale_tempo, W_SOUND), axis=1)
    df['energy'] = df.apply(
        lambda x: _generate_audio_feature_string('energy', x.energy, weight=W_SOUND), axis=1)
    df['acousticness'] = df.apply(
        lambda x: _generate_audio_feature_string('acousticness', x.acousticness, weight=W_SOUND), axis=1)
    df['danceability'] = df.apply(
        lambda x: _generate_audio_feature_string('danceability', x.danceability, weight=W_SOUND), axis=1)
    df['instrumentalness'] = df.apply(
        lambda x: _generate_audio_feature_string('instrumentalness', x.instrumentalness, weight=W_SOUND), axis=1)
    df['liveness'] = df.apply(
        lambda x: _generate_audio_feature_string('liveness', x.liveness, weight=W_SOUND), axis=1)
    df['speechiness'] = df.apply(
        lambda x: _generate_audio_feature_string('speechiness', x.speechiness, weight=W_SOUND), axis=1)
    df['valence'] = df.apply(
        lambda x: _generate_audio_feature_string('valence', x.valence, weight=W_SOUND), axis=1)

    feature_df = pd.DataFrame()
    feature_df = df[full_feature_list].apply(" ".join, axis=1)

    return feature_df


def create_song_vector_matrix():
    engine = get_db_connection()

    tracks_df = pd.read_sql_query("SELECT * FROM spotify_track", con=engine)
    tags_df = pd.read_sql_query("SELECT * FROM spotify_tag", con=engine)

    # Remove tracks with empty values
    tracks_df['genres'].replace('', np.nan, inplace=True)
    tracks_df = tracks_df.dropna()

    # Preprocess tags
    tags_df = _preprocess_tags(tags_df)

    # Merge track and tag data
    full_df = tracks_df.merge(
        tags_df, how="left", left_on="id", right_on="track_id")

    # Extracting track features
    spotify_ids = full_df['spotify_id']
    spotify_ids.to_csv('storage/spotify_ids.csv', index_label='index')

    feature_df = _extract_track_features(full_df)

    vect = CountVectorizer()
    vect_matrix = vect.fit_transform(feature_df)
    scipy.sparse.save_npz(
        'storage/sparse_track_feature_matrix.npz', vect_matrix)


def _recommend(df, similarity_matrix):
    similarity_scores = list(enumerate(similarity_matrix))
    similarity_scores_sorted = sorted(
        similarity_scores, key=lambda x: x[1], reverse=True)
    recommendations_indices = [
        t[0] for t in similarity_scores_sorted[1:]]
    return df.iloc[recommendations_indices]


def recommend_songs_for_profile(profile: scipy.sparse.csr.csr_matrix):
    engine = get_db_connection()

    #tracks_df = pd.read_sql_query("SELECT * FROM spotify_track", con=engine)
    recommendable_songs = pd.read_csv(
        'storage/spotify_ids.csv', index_col='index')

    track_feature_matrix = scipy.sparse.load_npz(
        'storage/sparse_track_feature_matrix.npz')

    similarity_matrix = cosine_similarity(track_feature_matrix, profile)
    recommendations = _recommend(recommendable_songs, similarity_matrix)

    return recommendations


def _get_user_profile(user: User):
    # ToDo What profile to chose on default?
    profiles = []
    for profile in os.listdir('storage/'):
        if f"user_profile_{user.id}" in profile:
            profiles.append(f"storage/{profile}")

    user_profile = scipy.sparse.load_npz(profiles[1])

    print(user_profile)

    return user_profile


def _get_all_user_profiles(user: User):
    profiles = {}
    for profile in os.listdir('storage/'):
        if f"user_profile_{user.id}" in profile:
            profiles[profile] = scipy.sparse.load_npz(f"storage/{profile}")

    return profiles


def get_previews_for_vector(vec_data: dict, user: User) -> str:
    user_profiles = _get_all_user_profiles(user)

    engine = get_db_connection()
    tracks_df = pd.read_sql_query(
        "SELECT spotify_id, name, artists, energy, valence, duration FROM spotify_track", con=engine)

    tracks_df.drop_duplicates(
        subset=['name', 'artists'], keep='first', inplace=True)
    tracks_df.drop(columns=['name', 'artists'], inplace=True)

    vec_coordinates = {
        'start': (vec_data['x_start'], vec_data['y_start']),
        'end': (vec_data['x_end'], vec_data['y_end'])
    }

    previews = {
        'start': {},
        'end': {}
    }

    for name, profile in user_profiles.items():
        print(f"User Profile {name}")
        recommended_songs = recommend_songs_for_profile(profile)

        recommended_songs = recommended_songs.merge(
            tracks_df, how="left", left_on="spotify_id", right_on="spotify_id")

        dynamic_filter_size = 0.05


        for pos, coordinates in vec_coordinates.items():
            (valence, energy) = coordinates
            print(valence, energy)
            filter = (recommended_songs['energy'] > energy - dynamic_filter_size) & (recommended_songs['energy'] < energy + dynamic_filter_size) & (recommended_songs['valence'] > valence - dynamic_filter_size) & (recommended_songs['valence'] < valence + dynamic_filter_size)

            filtered_track = recommended_songs[filter]
            track = filtered_track['spotify_id'].iloc[0]
            previews[pos][name] = track


    return previews
            



def create_playlist_for_vector(vector: MoodVector, user: User, spotify: Spotify) -> str:
    # Get the previously created user profile
    user_profile = _get_user_profile(user)

    # Get recommendations
    recommended_songs = recommend_songs_for_profile(user_profile)

    engine = get_db_connection()
    tracks_df = pd.read_sql_query(
        "SELECT spotify_id, name, artists, energy, valence, duration FROM spotify_track", con=engine)

    # drop duplicates (~7.2k)
    tracks_df.drop_duplicates(
        subset=['name', 'artists'], keep='first', inplace=True)
    tracks_df.drop(columns=['name', 'artists'], inplace=True)

    recommended_songs = recommended_songs.merge(
        tracks_df, how="left", left_on="spotify_id", right_on="spotify_id")

    n = int(vector.length * 1000 * 60 /
            recommended_songs.duration.quantile(q=0.3))
    song_ids = []
    x_dif = vector.x_start - vector.x_end
    y_dif = vector.y_start - vector.y_end

    print("Creating a playlist with {} tracks based on the ~avg. of {} mins per track".format(
        n, recommended_songs.duration.quantile(q=0.3) / 1000 / 60))
    print("Based on {} potentially interesting tracks of {} tracks in total".format(
        len(recommended_songs), len(tracks_df)))
    print("Start/End: {},{}/{},{}".format(vector.x_start,
          vector.y_start, vector.x_end, vector.y_end))

    # ToDo: implement dynamic filter size slider in frontend
    # ToDo: plot energy/valence of recommended tracks [song_ids]
    dynamic_filter_size = 0.05

    for i in range(1, n + 1):
        energy = vector.y_start - y_dif / n * i
        valence = vector.x_start - x_dif / n * i
        filter = (recommended_songs['energy'] > energy - dynamic_filter_size) & (recommended_songs['energy'] < energy + dynamic_filter_size) & (
            recommended_songs['valence'] > valence - dynamic_filter_size) & (recommended_songs['valence'] < valence + dynamic_filter_size)
        filtered_track = recommended_songs[filter]
        print("X/Y {}/{}, number of tracks to choose from: {}".format(valence,
              energy, len(filtered_track)))

        # Pick the first track not already present in recommended song
        track_postion = 0
        while True:
            if filtered_track['spotify_id'].iloc[track_postion] not in song_ids:
                print("Length:", len(recommended_songs))
                song_ids.append(
                    filtered_track['spotify_id'].iloc[track_postion])
                break
            track_postion += 1

    spotify_user_id = spotify.me()['id']

    # ToDo: calculate the closest emotion to the start- and endpoint respectively
    playlist = spotify.user_playlist_create(
        spotify_user_id, vector.name, public=False, description='Created with Spotify Vector Machine. We will be taking you from {} to {} my friend.'.format(
            "emotion1", "emotion2"))
    spotify.playlist_add_items(playlist['id'], song_ids)

    return playlist['uri']
