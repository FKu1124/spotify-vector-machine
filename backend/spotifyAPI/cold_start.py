#%%

import os
from typing import List
from tqdm import tqdm
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from pprint import pprint
import pandas as pd
from scipy.spatial import ConvexHull, convex_hull_plot_2d
from collections import defaultdict
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

def get_recent_tracks(printer = False) -> List:
    user = spotify.me()
    user = user["id"]
    print("Preparing to build the convex hull for user {}.".format(user))
    
    #### liked tracks
    # starting with liked tracks to get a realistic estimate for recent tracks
    # other order could lead to overly representing recent tracks (e.g. only a few liked tracks
    # are available)
    liked_tracks = {}
    liked_tracks_info = defaultdict(dict)

    liked_tracks = spotify.current_user_saved_tracks(limit = 50) # max limit
    for elem in liked_tracks['items'] :
        track = elem["track"]["id"]
        energy, valence = search_for_track_audio_features_en_val([
                                          elem["track"]["id"]])
        liked_tracks_info[(user, track)] = {"user_id" : user,
                                      "track_id" : track,
                                      "name" : elem["track"]["name"],
                                      "artist_id" : elem["track"]["album"]["artists"][0]
                                      ["id"],
                                      "artist_name" : elem["track"]["album"]["artists"][0]
                                      ["name"],
                                      "energy" : energy,
                                      "valence" : valence,
                                      "type" : "liked"}
    
    liked_tracks_df = pd.DataFrame.from_dict(liked_tracks_info, 
                                      orient = "index") 
    print("Fetching of liked tracks: Done. Total:", len(liked_tracks_df))
    
    #### recently played tracks
    recently_played = {}
    recently_played_info = defaultdict(dict)
    
    recently_played = spotify.current_user_recently_played(min(100 - len(liked_tracks_df), 50))
    for elem in recently_played['items'] :
        track = elem["track"]["id"]
        energy, valence = search_for_track_audio_features_en_val([
                                          elem["track"]["id"]])
        recently_played_info[(user, track)] = {"user_id" : user,
                                      "track_id" : track,
                                      "name" : elem["track"]["name"],
                                      "artist_id" : elem["track"]["album"]["artists"][0]
                                      ["id"],
                                      "artist_name" : elem["track"]["album"]["artists"][0]
                                      ["name"],
                                      "energy" : energy,
                                      "valence" : valence,
                                      "type" : "recent"}
            
    recently_played_df = pd.DataFrame.from_dict(recently_played_info, 
                                      orient = "index") 
    print("Fetching of recently played tracks: Done. Total:", len(recently_played_df))
    
    # dataframe merging the liked and recent tracks
    # sorted by energy (asc) for testing purposes
    combined_df = pd.DataFrame.merge(liked_tracks_df, recently_played_df, how = "outer").set_index(["user_id", "track_id"]) 
    user_specific_df = combined_df.loc[user, :].sort_values(by = ["energy"], ascending = [True]).reset_index()     
    
    energy = user_specific_df.energy
    valence = user_specific_df.valence
    name = user_specific_df.name
    track_id = user_specific_df.track_id
    type = user_specific_df.type
    
    concat = [energy, valence, name, track_id, type]
    concatted_df = pd.concat(concat, axis = 1).reset_index().set_index(["energy", "valence"])
    
    points = np.c_[energy, valence].reshape((-1, 2)) # reshape energy (x) and valence (y) to a compatible array
    liked = []
    recent = []
    for elem in points :
        x, y = elem[0], elem[1]
        if (concatted_df.loc[x, y]["type"] == "liked") : liked.append((x, y))
        if (concatted_df.loc[x, y]["type"] == "recent") : recent.append((x, y))
        
    combined = np.c_[energy, valence].reshape((-1, 2))    
    hull = ConvexHull(combined) # convex hull
       
    # plotting results, annotating figure, saving "convex" tracks for further use
    fig = plt.figure(dpi = 300)
    ax = fig.add_subplot()
    red_patch = mpatches.Patch(color= 'red', label= 'Liked Tracks')
    blue_patch = mpatches.Patch(color= 'green', label= 'Recent Tracks')
    ax.legend(handles= [red_patch, blue_patch])
    
    recent_x = [x[0] for x in recent]
    recent_y = [x[1] for x in recent]
    liked_x = [x[0] for x in liked]
    liked_y = [x[1] for x in liked]
    
    plt.plot(recent_x, recent_y, 'go', ms = 3.5)
    plt.plot(liked_x, liked_y, 'ro', ms = 3.5)

    #plt.plot(points[hull.vertices,0], points[hull.vertices,1], 'r--', lw=2)
    #plt.plot(points[hull.vertices[0],0], points[hull.vertices[0],1], 'ro')   
    ax.grid()   
    ax.set_xlim([0, 1])
    ax.set_ylim([0, 1])
    plt.xlabel("Energy")
    plt.ylabel("Valence")
    
    convex_hull_tracks = [] # tracks containing the track_id and name of "convex" tracks 
    for elem in hull.vertices:
        x, y = points[elem][0], points[elem][1]
        ax.annotate(concatted_df.loc[x, y]["name"], (x, y)) # annotate track title
        convex_hull_tracks.append([concatted_df.loc[x, y]["track_id"], concatted_df.loc[x, y]["name"][:30], 
                                   x, y, concatted_df.loc[x, y]["type"]])     

    for simplex in hull.simplices:
        plt.plot(points[simplex, 0], points[simplex, 1], 'k-', linewidth = 1)   
    plt.show()
    
    #convex hull 2d plot eases showing the plot, but does not allow to annotate the plot
    _ = convex_hull_plot_2d(hull)
    plt.show()
    
    print("\nConvex Hull has been created, there are {} tracks spanning the hull:".format(len(convex_hull_tracks)))
    
    if (printer) :
        #pprint(convex_hull_tracks)
        for elem in convex_hull_tracks :
            print("\"{}\", coords [en, val]: [{}, {}]".format(elem[1], elem[2], elem[3]))
    
    return convex_hull_tracks

# searches for energy and valence only   
def search_for_track_audio_features_en_val(track_ids: List[str], silent = True) -> dict:

    if (not(silent)) : print("Getting track features.\n")
    #for track_id in tqdm(track_ids, desc="tracks"):
    for track_id in track_ids :
        try:
            audio_features = spotify.audio_features(track_id)[0]
            return audio_features["energy"], audio_features["valence"],
        except:
            print(f"Could not find track: {track_id}")
            return 

if __name__ == "__main__":    
    scope = ["user-read-recently-played", "user-library-read"] # required for recent tracks
    
    FILE_DIR = os.path.dirname(__file__)
    spotify = spotipy.Spotify(
    auth_manager=SpotifyOAuth(scope = scope, 
                              client_id= "6827db0fdc9a4ffc8318954fcce54c8b", 
                              client_secret = "046ce5008d3844c9a661f86467fbf316", 
                              redirect_uri = "http://localhost:8888/callback"))
    
    convex = get_recent_tracks(printer = True)
    #pprint(convex)

# %%
