#%%

import os
from pprint import pprint
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt 

def heatmap2d():
    plt.hist2d(valence_x, energy_y, bins = 10, cmap = 'viridis', density = False)
    plt.colorbar()
    plt.title("Heat Map over all Tracks")
    plt.ylabel("Energy")
    #plt.xlabel(xlabel = "Valence")
    plt.tight_layout()
    plt.tick_params(axis = "y", right = True, labelright = True, left = False, labelleft = False)
    plt.tick_params(axis = "x", bottom = True, labelbottom = True)
    plt.show()

FILE_DIR = os.path.dirname("C:\\Users\\Tillus\\Desktop\\Studium\\Master\\Data Integration\\Turbo Recommender\\di-super-recommender3000\\backend\\spotifyAPI\\~placeholder~")

with open(os.path.join(FILE_DIR, 'tracks.json'), "r") as f:
    tracks_dict = json.load(f)

valence_x = []
energy_y = []

for index, elem in enumerate(tracks_dict) :
    temp = []
    valence_x.append(tracks_dict[elem]["valence"])
    energy_y.append(tracks_dict[elem]["energy"])
    if (index % 10000 == 0) : print("Still doing stuff, {} steps remaining.".format(len(tracks_dict) - index))
    #if (index > 10000) : print("Breaking."); break

#tracks_df = pd.DataFrame(tracks_dict)
#pprint(tracks[next(iter(tracks))])
#track_features = np.asarray(track_features)

heatmap2d()
# %%
