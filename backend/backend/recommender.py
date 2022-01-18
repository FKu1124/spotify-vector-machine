#%%

import pandas as pd
import numpy as np
from pprint import pprint
import os
from scipy import spatial
from tqdm import tqdm
from typing import List

FILE_DIR = "C:\\Users\\Tillus\\Desktop\\Turbo Recommender\\spotify-vector-machine\\backend\\spotifyAPI"

# takes a list (x1,x2,y1,y2) and returns two arrays
def build_two_vectors(input_coordinates = "", printer = False) :
    if (not(input_coordinates)) : coordinates = input("(doesnt work)Please put in x1y2x2y2")
    coords = np.array(input_coordinates).reshape((2,2))
    if(printer) : print("Working with X={}, Y={}".format(coords[0][:], coords[1][:]))
    return coords[0][:], coords[1][:]

# takes list (x1,x2) and returns one array
def build_single_vector(input_coordinates = "", printer = False) :
    if (not(input_coordinates)) : coordinates = input("(doesnt work)Please put in x1x2")
    coords = np.array(input_coordinates).reshape((1,2))
    if(printer) : print("Working with X={}".format(coords[0][:]))
    return coords[0][:]

# returns track details from the tracks dataframe
def get_track_details(id: str) :
    pprint("Printing details for ID: {}, Name: {}.".format(id, tracks_df.loc[id][0]))
    pprint(tracks_df.loc[id])

# takes two arrays and computes the cosine similarity 
# automatically converts the format from above functions to comaptible ones
def calculate_cosine_similarity(x, y, printer = False) :
    distance =  1 - spatial.distance.cosine(list(x), list(y))
    if(printer) : pprint("Cosine Distance between {} and {} is: {}".format(x, y, distance))
    return distance   

# average track length (draft, has been erased)
"""def calculate_average_length() :
    average_length = tracks_df.sum()
    print(average_length)
    return average_length"""

# calculate similarities between one track (track_id as input) and a point
# and creates a similarity matrix based on every single dataframe entry
def calculate_similarities(point, track_id: str, loop = False) :    
    print("Distance between track \"{}\" and point {}".format(tracks_df.loc[track_id][0], point))
    track_id_pos = build_single_vector([tracks_df.loc[track_id].energy, tracks_df.loc[track_id].valence])
    print("Distance between track \"{}\" and point {}".format(track_id_pos, point))

    # loop: if (!loop) : does not build the entire distance matrix
    similarity = pd.DataFrame(columns = ["distance"])
    if (loop) :
        for index, elem in tqdm(tracks_df.iterrows(), total = tracks_df.shape[0], desc = "distance") :
            track_features = build_single_vector([elem.energy, elem.valence])
            similarity.loc[index] = calculate_cosine_similarity(track_features, x)

        similarity.sort_values(by = ["distance"], na_position = "last", ascending = True,
            inplace = True, kind = "heapsort")
        print(similarity.head(10))

# calculates n points on a given vector 
# input: list of two points [x1x2y1y2], number of steps
def calculate_points_on_vector(input: List, number: int) :
    if (number < 3) : print("At least three steps required, exiting."); return
    
    start, end = build_two_vectors(input)
    print("Vector from {} to {} in {} steps.".format(start, end, number))

    x_diff = (end[0] - start[0]) / (number - 1)
    y_diff = (end[1] - start[1]) / (number - 1)
    x_new, y_new = build_single_vector([start[0], start[1]])

    for i in range (0, number) : 
        build_single_vector([x_new, y_new], printer = True)
        x_new += x_diff
        y_new += y_diff

"""def initialize_tracks_dataframe() :
    print("Initializing.")
    tracks_df = pd.read_json(os.path.join(FILE_DIR, "tracks.json"), orient = "index")
    tracks_df.set_index(["id"], inplace = True)
    tracks_df.drop(columns = ["album_id", "artists"], inplace = True)
    print("Initializing Done.")
    return tracks_df"""

if __name__  == "__main__" : 
    print("Building Tracks Dataframe.")
    tracks_df = pd.read_json(os.path.join(FILE_DIR, "tracks.json"), orient = "index")
    tracks_df.set_index(["id"], inplace = True)
    tracks_df.drop(columns = ["album_id", "artists"], inplace = True)
    print("Done.")

    get_track_details("4k8xVyY1HD0ApyOofQl5aE")
    x, y = build_two_vectors([0.4, 0.3, 0.9, 0.8])
    calculate_cosine_similarity(x, y, printer = True)
    z = build_single_vector([0.3, 0.1])
    calculate_similarities(point = z, track_id = "4k8xVyY1HD0ApyOofQl5aE")
    calculate_points_on_vector([0.1, 0.4, 0.5, 0.8], number = 5)
    calculate_points_on_vector([0.5, 0.8, 0.1, 0.4], number = 5)

# %%
