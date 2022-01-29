import math

from django.contrib.auth.models import User
from django.db.models import Count
import scipy.sparse
import pandas as pd

from spotify.models import UserTrack, Track
from spotipy import Spotify

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
    def _create_user_track_mappings(tracks, type: str):
        for track in tracks['items']:
            track_obj, created = Track.objects.get_or_create(
                spotify_id=track['id'])
            UserTrack.objects.get_or_create(
                user=user, track=track_obj, type=type)

    top_tracks_short = spotify.current_user_top_tracks(
        limit=50, time_range='short_term')
    top_tracks_medium = spotify.current_user_top_tracks(
        limit=50, time_range='medium_term')
    top_tracks_long = spotify.current_user_top_tracks(
        limit=50, time_range='long_term')
    # recent_track = spotify.current_user_recently_played()
    # saved_tracks = spotify.current_user_saved_tracks(limit=50)

    _create_user_track_mappings(top_tracks_short, 'top_tracks_short')
    _create_user_track_mappings(top_tracks_medium, 'top_tracks_medium')
    _create_user_track_mappings(top_tracks_long, 'top_tracks_long')
    # _create_user_track_mappings(recent_track, 'recent')
    # _create_user_track_mappings(saved_tracks, 'saved')


def _generate_user_profile(user_id) -> None:
    recommendable_songs = pd.read_csv(
        'storage/spotify_ids.csv', index_col='index')
    track_feature_matrix = scipy.sparse.load_npz(
        'storage/sparse_track_feature_matrix.npz')

    tracks = Track.objects.filter(
        usertrack__user=4, name__isnull=False, spotify_id__in=recommendable_songs['spotify_id'].tolist())

    spotify_ids = list(tracks.values_list('spotify_id', flat=True))
    tracks_df = recommendable_songs[recommendable_songs['spotify_id'].isin(
        spotify_ids)]

    spotify_id_vect_id = {}
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


def create_user_profile(user: User, spotify: Spotify):
    _get_user_profile_tracks(user, spotify)
    _generate_user_profile(user.id)
