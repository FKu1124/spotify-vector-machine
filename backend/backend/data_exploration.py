# first try at associating a certain genre to a track
# idea scrapped at 09/12, uploaded to keep the code somewhere

import json
import os
from pprint import pprint

global tracks
global artists
global failed_artists

failed_artists = {}
failed_tracks = []
tracks_with_one_genre = {}
number_of_genres_dict = {}

failed_artists[-1] = "##### Failed Artists: #####"
number_of_genres_dict[-1] = "##### Number of Genres: #####"
tracks_with_one_genre[-1] = "##### Tracks with one Genre: #####"

def count_artists(input_tracks, iterations) :

    # outer loop, iterates over all entries in the input_tracks dictionary
    for outer_index, input_track in enumerate(input_tracks) :
        print("\nHey, I'm in the {}th iteration :)".format(outer_index))

        try :

            track_name = input_tracks[input_track]['name']
            number_of_artists = len(input_tracks[input_track]['artists'])
            print("Currently looking at \"{}\", which has {} artist(s).".format(track_name, number_of_artists))
        
        except : print("Track {} is not present".format(track_name)); failed_tracks.append(input_tracks[input_track]['id']); continue
        
        # inner loop, iterates over every artist from the outer loop's track
        for inner_loop, artist in enumerate(input_tracks[input_track]['artists']) :

            try : artist_name = artists[artist['id']]['name']
            except : 
                print("Artist {} is not present".format(input_tracks[input_track]['artists'][inner_loop]['name']))
                failed_artists[artist['id']] = input_tracks[input_track]['artists'][inner_loop]['name']; continue

            number_of_genres = len(artists[artist['id']]['genres'])  
            print("Amount of genres for \"{}\" is {}".format(artist_name, number_of_genres))
            
            # if one of the artists for the current tracks has only one genre, add it to a dict
            #if (number_of_genres == 2) : tracks_with_one_genre[input_tracks[input_track]['id']] = input_tracks[input_track]['id']           
            try : number_of_genres_dict[number_of_genres] = number_of_genres_dict[number_of_genres] + 1
            except KeyError : number_of_genres_dict[number_of_genres] = 0; number_of_genres_dict[number_of_genres] = number_of_genres_dict[number_of_genres] + 1; continue
            
            """try :
                print("Amount of genres for \"{}\" is {}".format(artist_name, number_of_genres))
            except : print("Artist for-loop has fucked up"); next   """         

        if outer_index == iterations : break

FILE_DIR = os.path.dirname(__file__)

with open(os.path.join(FILE_DIR, 'tracks.json'), "r") as f:
    tracks = json.load(f)

with open(os.path.join(FILE_DIR, 'artists.json'), "r") as f:
    artists = json.load(f)

count_artists(tracks, iterations = 1000)

pprint(failed_artists)
pprint(tracks_with_one_genre)
pprint(number_of_genres_dict)

sum = 0
for elem in number_of_genres_dict :
    if (elem == - 1) : continue
    sum = int(number_of_genres_dict[elem]) + sum

print("Total elements:", sum)

#print("Sum:", sum, "\nNumber of tracks:", len(tracks))
#print(artists["0bfU48sSFFAhlaKCL05dTG"])