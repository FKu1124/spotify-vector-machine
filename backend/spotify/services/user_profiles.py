import math
from typing import List

from django.contrib.auth.models import User
from django.db.models import Count
from django.core.exceptions import MultipleObjectsReturned
import scipy.sparse
import pandas as pd
from sqlalchemy import null
from django.db import connection
from django_pandas.io import read_frame

from .recommender import create_song_vector_matrix, get_db_connection
from spotify.models import UserTrack, Track
from spotipy import Spotify
from .spotify_scraping import save_tracks_by_id, save_or_update_track

TYPE_WEIGHTS = {
    'top_tracks_short': 1,
    'top_tracks_medium': 2,
    'top_tracks_long': 3,
    'recent': 2,
    'saved': 6,
    'feedback_positive': 1,
    'feedback_negative': 1
}


def _get_user_profile_tracks(user: User, spotify: Spotify):
    print("Starting to create the user profile.")

    # def _create_user_track_mappings(tracks, type: str):
    #     for track in tracks['items']:
    #         track_obj, created = Track.objects.get_or_create(
    #             spotify_id=track['id'])
    #         if created:
    #             newly_added.append(track['id'])
    #         try:
    #             UserTrack.objects.get_or_create(
    #                 user=user, track=track_obj, type=type)
    #         except MultipleObjectsReturned:
    #             pass

    # variation for liked/recent tracks

    def _create_user_track_mappings(tracks: List, type: str) -> None:

        for track in tracks:
            track_obj = save_or_update_track(track)

            if track_obj:
                UserTrack.objects.get_or_create(user=user,
                                                track=track_obj,
                                                type=type)

                # newly_added_count += 1

    newly_added_count = 0

    print(
        "Fetching recent and liked tracks... (previous step's new: {})".format(newly_added_count))
    saved_tracks = spotify.current_user_saved_tracks(limit=50)['items']
    recent_tracks = spotify.current_user_recently_played(limit=50)['items']
    saved_tracks = [t['track'] for t in saved_tracks]
    recent_tracks = [t['track'] for t in recent_tracks]
    _create_user_track_mappings(saved_tracks, 'saved')
    _create_user_track_mappings(recent_tracks, 'recent')

    print("Fetching top tracks... (previous step's new: {})".format(
        newly_added_count))
    top_tracks_short = spotify.current_user_top_tracks(limit=50,
                                                       time_range='short_term')['items']
    top_tracks_medium = spotify.current_user_top_tracks(limit=50,
                                                        time_range='medium_term')['items']
    top_tracks_long = spotify.current_user_top_tracks(limit=50,
                                                      time_range='long_term')['items']

    _create_user_track_mappings(top_tracks_short, 'top_tracks_short')
    _create_user_track_mappings(top_tracks_medium, 'top_tracks_medium')
    _create_user_track_mappings(top_tracks_long, 'top_tracks_long')

    tracks_with_missing_values = Track.objects.filter(
        spotify_id__isnull=False).filter(energy__isnull=True).filter(valence__isnull=True)

    if tracks_with_missing_values:
        print("Deleting & Re-fetching {} tracks that have missing values...".format(
            len(tracks_with_missing_values)))
        newly_added_count -= len(tracks_with_missing_values)

        for shitty_track in tracks_with_missing_values:
            track_id = shitty_track.id
            shitty_track.delete()

            track_response = next((i for i in saved_tracks if i['id'] == track_id),
                                  None)
            if track_response:
                _create_user_track_mappings(track_response, 'saved')

            track_response = next((i for i in recent_tracks if i['id'] == track_id),
                                  None)
            if track_response:
                _create_user_track_mappings(track_response, 'recent')

            track_response = next((i for i in top_tracks_short if i['id'] == track_id),
                                  None)
            if track_response:
                _create_user_track_mappings(track_response, 'top_tracks_short')

            track_response = next((i for i in top_tracks_medium if i['id'] == track_id),
                                  None)
            if track_response:
                _create_user_track_mappings(
                    track_response, 'top_tracks_medium')

            track_response = next((i for i in top_tracks_long if i['id'] == track_id),
                                  None)
            if track_response:
                _create_user_track_mappings(track_response, 'top_tracks_long')

            if not track_response:
                save_or_update_track(track)
                newly_added_count += 1

    print("Added {} new tracks and their features to the data base. New IDs:".format(
        newly_added_count))


def _generate_user_profile(user_id) -> None:

    track_feature_matrix = scipy.sparse.load_npz(
        'storage/sparse_track_feature_matrix.npz')

    # connect to database, get all tracks that could potentially be recommended
    engine = get_db_connection()
    recommendable_songs = pd.read_sql_query("SELECT id, spotify_id \
                                            FROM spotify_track \
                                            WHERE energy IS NOT NULL AND valence IS NOT NULL;",
                                            con=engine)

    # filters tracks corresponding to the user's history (recent tracks, ...)
    tracks = Track.objects.filter(
        usertrack__user=user_id, energy__isnull=False, valence__isnull=False, name__isnull=False)
    spotify_ids = list(tracks.values_list('spotify_id', flat=True))

    # for debugging purposes: in earlier versions, there have been duplicates in the user profiles
    diff = []
    for elem in spotify_ids:
        if elem not in recommendable_songs.spotify_id.values:
            diff.append(elem)
    if len(diff) != 0:
        print("WARNING, THERE ARE {} POTENTIAL DUPLICATES!".format(len(diff)))

    spotify_id_vect_id = {}
    tracks_df = read_frame(tracks)
    for track in tracks_df.itertuples():
        weight = 0

        user_tracks = UserTrack.objects.filter(
            user=user_id, track__spotify_id=track.spotify_id)

        for user_track in user_tracks:
            weight = weight + TYPE_WEIGHTS[user_track.type]

        # in weight we store the cummulated weights of the occurences of the song
        # e.g. in top_tracks_short and recent, we then add those weights up
        spotify_id_vect_id[track.spotify_id] = {
            'vect': track_feature_matrix[track.Index],
            'weight': weight
        }

    cluster_count = tracks.filter(spotify_id__in=spotify_ids).values_list(
        'cluster').annotate(count=Count('cluster'))

    cluster_count = sorted(list(cluster_count),
                           key=lambda x: x[1], reverse=True)

    count_threshhold = math.ceil(len(spotify_ids) * 0.05)
    user_profiles = {}

    for (cluster, count) in cluster_count:
        if count > count_threshhold:
            cluster_track_ids = tracks.filter(
                cluster=cluster).values_list('spotify_id', flat=True)
            user_profiles[cluster] = [(spotify_id, vect_weight) for spotify_id, vect_weight
                                      in spotify_id_vect_id.items()
                                      if spotify_id in cluster_track_ids]

    for cluster, vect_weights in user_profiles.items():
        count_weight = 0
        user_profile = None
        ids = []
        for spotify_id, vect_weight in vect_weights:
            ids.append(spotify_id)
            if user_profile is None:
                user_profile = vect_weight['vect'] * vect_weight['weight']
            else:
                user_profile = user_profile + \
                    vect_weight['vect'] * vect_weight['weight']

            count_weight += weight

        user_profile = user_profile / count_weight

        weights = (weight for weight in user_profile)

        scipy.sparse.save_npz(
            f'storage/user_profile_{user_id}_{cluster}.npz', user_profile)

    print("User profiles have been created.")


def create_user_profile(user: User, spotify: Spotify):
    _get_user_profile_tracks(user, spotify)
    _generate_user_profile(user.id)
