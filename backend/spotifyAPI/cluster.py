from os import mkdir
from os.path import join, dirname, isdir
from typing import List, Tuple

from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from tqdm import tqdm

from json_parser import load_json, pretty_print_json, dump_json

FILE_DIR = dirname(__file__)


def load_artists() -> dict:
    return load_json(join(FILE_DIR, "artists.json"))


def load_tracks() -> dict:
    return load_json(join(FILE_DIR, "tracks.json"))


def load_genres() -> dict:
    return load_json(join(FILE_DIR, "genres.json"))


def load_cluster(cluster_number: int) -> dict:
    return load_json(join(FILE_DIR, "cluster_results", f"cluster_number-{cluster_number}.json"))


def get_track_features(tracks: dict) -> Tuple[np.array, List[str]]:
    feature_order = ["danceability",
                     "energy",
                     "key",
                     "mode",
                     "loudness",
                     "speechiness",
                     "acousticness",
                     "instrumentalness",
                     "liveness",
                     "valence",
                     "tempo",
                     "time_signature"]

    track_features = []
    for track in tracks:
        t = tracks[track]
        features = []
        for feature in feature_order:
            features.append(t[feature])

        track_features.append(features)

    track_features = np.array(track_features)

    return track_features, feature_order


def scale_features(track_features: np.array) -> np.array:
    scaler = StandardScaler()

    return scaler.fit_transform(track_features)


def save_cluster_result(Y: np.array, cluster_centers: np.array, feature_order: List[str], config: dict, file_name: str):
    dir_path = join(FILE_DIR, "cluster_results")
    if not isdir(dir_path):
        mkdir(dir_path)

    cluster_result = {"config": config,
                      "feature_order": feature_order,
                      "cluster_centers": cluster_centers.tolist(),
                      "labels": Y.tolist()}

    path = join(dir_path, file_name)
    dump_json(cluster_result, path)


def KMeans_grid_search(X: np.array, feature_order: List[str], min_clusters=1, max_clusters=126, init="k-means++", n_init=100, max_iter=500, tol=1e-04):
    for n in tqdm(range(min_clusters, max_clusters+1)):
        km = KMeans(n_clusters=n, init=init, n_init=n_init,
                    max_iter=max_iter, tol=tol, random_state=42)
        Y = km.fit_predict(X)
        config = km.get_params()
        cluster_centers = km.cluster_centers_
        file_name = f"cluster_number-{n}"

        save_cluster_result(Y, cluster_centers,
                            feature_order, config, file_name)


def WCSS(cluster_center, cluster_number, track_features, track_labels) -> float:
    wcss = 0.0
    tracks_in_cluster = 0
    track_number = 0
    for track in track_features:
        if cluster_number == track_labels[track_number]:
            # print(type(cluster_center))
            # print(type(track))
            # print(cluster_center - track)
            wcss += np.sum((cluster_center - track)**2)
            tracks_in_cluster += 1
        track_number += 1

    wcss /= tracks_in_cluster
    print(tracks_in_cluster)
    return wcss


def total_WCSS(cluster_centers, track_features, track_labels) -> float:
    total_wcss = 0.0
    for cluster in range(len(cluster_centers)):
        total_wcss += WCSS(cluster_centers[cluster],
                           cluster, track_features, track_labels)

    return total_wcss
