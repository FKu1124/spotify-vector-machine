import math
import os

from django.contrib.auth.models import User
from django.db.models import Count
from django.core.exceptions import MultipleObjectsReturned
import scipy.sparse
import pandas as pd
from sqlalchemy import null
from django.db import connection

from .recommender import create_song_vector_matrix, get_db_connection
from spotify.models import UserTrack, Track
from spotipy import Spotify
from .spotify_scraping import save_tracks_by_id

# Weights applied to different types of implicit and explicit user feedback.
TYPE_WEIGHTS = {
    'top_tracks_short': 1,
    'top_tracks_medium': 1,
    'top_tracks_long': 1,
    'recent': 1,
    'saved': 1,
    'feedback_positive': 1,
    'feedback_negative': 1
}


def _get_user_profile_tracks(user: User, spotify: Spotify):

    print("Starting to create the user profile.")
    newly_added = []

    def _create_user_track_mappings(tracks, type: str):
        for track in tracks['items']:
            track_obj, created = Track.objects.get_or_create(
                spotify_id=track['id'])
            if created:
                newly_added.append(track['id'])
            try:
                UserTrack.objects.get_or_create(
                    user=user, track=track_obj, type=type)
            except MultipleObjectsReturned:
                pass

    # variation for liked/recent tracks
    def _create_user_track_mappings_recent(tracks, type: str):
        for elem in tracks['items']:
            track_obj, created = Track.objects.get_or_create(
                spotify_id=elem['track']['id'])
            if created:
                newly_added.append(elem['track']['id'])
            try:
                UserTrack.objects.get_or_create(
                    user=user, track=track_obj, type=type)
            except MultipleObjectsReturned:
                pass

    print("Fetching recent and liked tracks... (previous step's new: {})".format(
        len(newly_added)))
    saved_tracks = spotify.current_user_saved_tracks(limit=50)
    recent_tracks = spotify.current_user_recently_played(limit=50)
    _create_user_track_mappings_recent(saved_tracks, 'saved')
    _create_user_track_mappings_recent(recent_tracks, 'recent')

    print("Fetching top tracks... (previous step's new: {})".format(len(newly_added)))
    top_tracks_short = spotify.current_user_top_tracks(
        limit=50, time_range='short_term')
    top_tracks_medium = spotify.current_user_top_tracks(
        limit=50, time_range='medium_term')
    top_tracks_long = spotify.current_user_top_tracks(
        limit=50, time_range='long_term')
    _create_user_track_mappings(top_tracks_short, 'top_tracks_short')
    _create_user_track_mappings(top_tracks_medium, 'top_tracks_medium')
    _create_user_track_mappings(top_tracks_long, 'top_tracks_long')

    print("Deleting & Re-fetching {} tracks that have missing values...".format(
        Track.objects.filter(spotify_id__isnull=False).filter(energy__isnull=True).count()))

    Track.objects.filter(spotify_id__isnull=False).filter(
        energy__isnull=True).delete()
    save_tracks_by_id(newly_added)

    with connection.cursor() as cursor:
        cursor.execute(
            "DELETE FROM spotify_track a using spotify_track b WHERE a.id < b.id and a.spotify_id = b.spotify_id;")
        cursor.execute(
            "DELETE FROM spotify_usertrack a using spotify_usertrack b WHERE a.id < b.id and a.track_id = b.track_id;")

    print("Added {} new tracks and their features to the data base. New IDs:".format(
        len(newly_added)))
    print(newly_added)


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

    spotify_id_vect_id = {}
    tracks_df = read_frame(tracks)
    for track in tracks_df.itertuples():
        weight = 0

        user_tracks = UserTrack.objects.filter(
            user=user_id, track__spotify_id=track.spotify_id)

        for user_track in user_tracks:
            weight = weight + TYPE_WEIGHTS[user_track.type]

        spotify_id_vect_id[track.spotify_id] = {
            'vect': track_feature_matrix[track.Index],
            'weight': weight
        }

    cluster_count = tracks.filter(spotify_id__in=spotify_ids).values_list(
        'cluster').annotate(count=Count('cluster'))

    cluster_count = sorted(list(cluster_count),
                           key=lambda x: x[1], reverse=True)

    count_threshhold = math.ceil(len(spotify_ids) * 0.1)
    user_profiles = {}

    for (cluster, count) in cluster_count:
        if count > count_threshhold:
            cluster_track_ids = tracks.filter(
                cluster=cluster).values_list('spotify_id', flat=True)
            user_profiles[cluster] = [vect_weight for spotify_id,
                                      vect_weight in spotify_id_vect_id.items() if spotify_id in cluster_track_ids]

    for cluster, vect_weights in user_profiles.items():
        count_weight = 0
        user_profile = None

        for vect_weight in vect_weights:
            if user_profile is None:
                user_profile = vect_weight['vect'] * vect_weight['weight']
            else:
                user_profile = user_profile + \
                    vect_weight['vect'] * vect_weight['weight']

            count_weight = count_weight + weight

        user_profile = user_profile / count_weight

        scipy.sparse.save_npz(
            f'storage/user_profile_{user_id}_{cluster}.npz', user_profile)

    print("User profiles have been created.")


def get_user_profile_clusters(user: User):
    profiles = []
    for profile in os.listdir('storage/'):
        if f"user_profile_{user.id}" in profile:
            profiles.append(f"storage/{profile}")

    user_cluster = [cluster.split('_')[-1].replace('.npz', '')
                    for cluster in profiles]
    return user_cluster


def create_user_profile(user: User, spotify: Spotify):
    """ Generates and saves user profiles for logged in user.

    This is done by first fetching all available user listening data from the
    Spotify API. Afterwards, the most relevant genre-clusters are extracted
    and for each a user-profile calculted based on the tracks present in each
    cluster.
    """
    _get_user_profile_tracks(user, spotify)
    _generate_user_profile(user.id)
