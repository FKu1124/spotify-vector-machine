# everynoise.com scraping [first draft]
# some of the spotify genres are not present at everynoise.com
# missing genres -> bad_URLs.json
# bad_URLs should not contain any syntax-related errors

from bs4 import BeautifulSoup
import os
import requests
import json
from pprint import pprint

def request_web_page(URL, soup = True) :
    request = requests.get(URL)  
    
    if (request.status_code != 200):
        print("Site noch reachable, HTTP status ", request.status_code)
        print("Failed URL:", URL)
        bad_URLs.append(URL)
        return str(0)

    else:            
        soup_full = BeautifulSoup(request.text, 'html.parser')
        if (soup) : return soup_full
        
        else: return request.text

def build_genre_URL(genre) :
    genre = str(genre).replace(" ", "")
    genre = genre.replace("-", "")
    genre = genre.replace("&", "")
    genre = genre.replace("+", "")
    return "https://everynoise.com/engenremap-" + genre + ".html"

global genre_URLs
global bad_URLs

genre_URLs = []
bad_URLs = []

#FILE_DIR = os.path.dirname(__file__)
FILE_DIR = os.path.dirname("C:\\Users\\Tillus\\Desktop\\Studium\\Master\\Data Integration\\Turbo Recommender\\di-super-recommender3000\\backend\\spotifyAPI\\~placeholder~")

with open(os.path.join(FILE_DIR, 'genres.json'), "r") as f:
    genres = json.load(f)

# create genre URLs for "everynoise.com"
for elem in genres['genres'] :
    genre_URLs.append(build_genre_URL(elem))

# get page for genre URL
for index, elem in enumerate(genre_URLs) :
    request_web_page(elem)
    if (index % 5 == 0):
        print("Still doing stuff, {} steps remaining.".format(len(genre_URLs) - index))

pprint(bad_URLs)
print("Number of bad URLS:", len(bad_URLs))

with open(os.path.join(FILE_DIR, 'bad_URLs.json'), "w") as f:
    json.dump(bad_URLs, f)