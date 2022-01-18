# data analysis & visualization draft

#%%

import os
import json
from pprint import pprint
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import preprocessing
from scipy import stats

def initialize_stuff() :
    global tracks
    FILE_DIR = os.path.dirname("C:\\Users\\Tillus\\Desktop\\Studium\\Master\\Data Integration\\Turbo Recommender\\di-super-recommender3000\\backend\\spotifyAPI\\~placeholder~")

    with open(os.path.join(FILE_DIR, 'tracks.json'), "r") as f:
        tracks = json.load(f)
    
    tracks = pd.DataFrame.from_dict(tracks, orient = "index")

    print("Initializing done, there are {} tracks, data type is: {}".format(len(tracks), type(tracks)))

initialize_stuff()
#pprint(tracks[['energy', 'valence']].describe())

"""              energy        valence
count  118227.000000  118227.000000
mean        0.586649       0.434857
std         0.285811       0.270831
min         0.000000       0.000000
25%         0.355000       0.205000
50%         0.619000       0.411000
75%         0.843000       0.649000
max         1.000000       1.000000"""

features = ["energy", "valence", "duration_ms", "acousticness", 
         "danceability", "instrumentalness", "liveness", 
         "loudness", "speechiness"]

nbins = 35
text_fontsize = 10

fig, ((energy, valence, dur), (acoustic, dance, instrumental), (live, loud, speechi)) = plt.subplots(nrows = 3, ncols = 3)

energy.hist(tracks['energy'], nbins, density = False, histtype = 'bar')
energy.tick_params(axis = 'x', labelsize = 5)
energy.tick_params(axis = 'y', labelsize = 7)
energy.set_title('Energy (abs.)')
energy.grid()

valence.hist(tracks['valence'], nbins, density = False, histtype = 'bar', color = "green")
valence.tick_params(axis = 'x', labelsize = 5)
valence.tick_params(axis = 'y', labelsize = 7)
valence.set_title('Valence (abs.)')
valence.grid()

duration = tracks['duration_ms'] / 60 / 1000
duration = duration.sort_values(ascending = True)
duration = pd.DataFrame(stats.trimboth(duration, 0.0005)) # eliminate absurd track lengths, such as 95 mins
dur.hist(duration, nbins, density = False, histtype = 'bar', color = "orange")
dur.tick_params(axis = 'x', labelsize = 5)
dur.tick_params(axis = 'y', labelsize = 7)
dur.set_title('#Duration (abs.)')
dur.grid()
plt.text(0.4, 0.8, "In Minutes; Covers \n99.95% of data", fontsize = text_fontsize, fontstyle = 'italic', color = 'blue', transform = dur.transAxes)

acoustic.hist(tracks['acousticness'], nbins, density = False, histtype = 'bar')
acoustic.tick_params(axis = 'x', labelsize = 5)
acoustic.tick_params(axis = 'y', labelleft = False)
acoustic.set_title('Acousticness (abs.)')
acoustic.grid()

dance.hist(tracks['danceability'], nbins, density = True, histtype = 'bar', color = "green")
dance.tick_params(axis = 'x', labelsize = 5)
dance.tick_params(axis = 'y', labelsize = 7)
dance.set_title('Danceability')
dance.grid()

instrumental.hist(tracks['instrumentalness'], nbins, density = False, histtype = 'bar', color = "orange")
instrumental.tick_params(axis = 'x', labelsize = 5)
instrumental.tick_params(axis = 'y', labelsize = 7)
instrumental.set_title('#Instrumentalness (abs.)')
instrumental.grid()

live.hist(tracks['liveness'], nbins, density = False, histtype = 'bar')
live.tick_params(axis = 'x', labelsize = 5)
live.tick_params(axis = 'y', labelsize = 7)
live.set_title('Liveness (abs.)')
live.grid()

loudness = tracks['loudness'] + abs(tracks['loudness'].min()) # make all values strictly greater than 0 while keeping its original scale
loud.hist(loudness / loudness.max(), nbins, density = True, histtype = 'bar', color = "green")
loud.tick_params(axis = 'x', labelleft = False)
loud.tick_params(axis = 'y', labelsize = 7)
loud.set_title('#Loudness')
loud.grid()
plt.text(0.1, 0.8, "Normalized ϵ [0; 1]", fontsize = text_fontsize, fontstyle = 'italic', color = 'blue', transform = loud.transAxes)

speechi.hist(tracks['speechiness'], nbins, density = False, histtype = 'bar', color = "orange")
speechi.tick_params(axis = 'x', labelsize = 5)
speechi.tick_params(axis = 'y', labelsize = 7)
speechi.set_title('#Speechiness (abs.)')
speechi.grid()

font = {'size' : 12}
plt.rc('font', **font)
fig.tight_layout()
fig.set_size_inches(12, 12)
fig.set_dpi(300)
plt.show()

"""x = tracks['loudness'].values.reshape(-1, 1)
scaler = preprocessing.StandardScaler()
x_scaled = scaler.fit_transform(x)
print(x)"""

# %%
