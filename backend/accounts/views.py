import os
import time
from urllib.request import HTTPRedirectHandler

from sklearn.cluster import cluster_optics_xi
from accounts.serializers import MoodVectorSerializer
from spotify.models import UserTrack
from spotify.services.recommender import create_playlist_for_vector, get_previews_for_vector
from spotify.services.user_profiles import create_user_profile, get_user_profile_clusters


from django.contrib import auth
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import DjangoSessionCacheHandler

# Scope = Access rights to user data (playlists, favourites, ...) & functions (playlist creation, playback control, ...)
scope = "streaming user-read-email user-read-private user-top-read user-read-recently-played user-read-playback-state user-read-playback-position user-library-read user-library-modify playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"

# Get params needed for API requests from env
client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })

# Login and Signup 
@method_decorator(csrf_protect, name='dispatch')
class LoginWithSpotify(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            cache_handler = DjangoSessionCacheHandler(request=request)
            auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)
            # Case 2: Spotify responds to auth attempt via given callback uri
            if self.request.GET.get("code"):
                auth_manager.get_access_token(self.request.GET.get("code"))

                spotify = spotipy.Spotify(auth_manager=auth_manager)
                user_data = spotify.me()
                username = user_data['id']
                email = user_data['email']
                first_name = user_data['display_name']

                # TODO: Solve password issue 
                password = "BASEPASSWORD1234s"
                if not User.objects.filter(username=username).exists():
                    # Create User
                    user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name)
                    user.save()
                # Sign User in
                user = auth.authenticate(username=username, password=password)
                auth.login(request, user)
                
                # return redirect("/")
                return HttpResponseRedirect(redirect_to="http://localhost:3000")
            # Case 1: User initiates authentication and retrieves auth_url
            try:
                if not auth_manager.validate_token(cache_handler.get_cached_token()):
                    auth_url = auth_manager.get_authorize_url()
                    return Response({ 'status': True, 'auth_url': auth_url }, status=status.HTTP_200_OK)
            except:
                return Response({ 'status': False, 'msg': 'Error authenticating' }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return redirect("/Login?error=true")
        # Case 3: User is already authenticated with Spotify 
        # return Response({ 'status': 'Success' })

# Check if user is logged in / there is a currently active session
@method_decorator(csrf_protect, name='dispatch')
class CheckAuthentication(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            return Response({ 'status': True if request.session.get('_auth_user_id', 0) else False, 'msg': '' }, status=status.HTTP_200_OK)
        except:
            return Response({ 'error': 'Error checking authentication' })


@method_decorator(csrf_protect, name='dispatch')
class GetUserProfile(APIView):

    def get(self, request, format=None):
        try:
            user = self.request.user
            user = User.objects.get(username=user.username)

            return Response({ 'status': True, 'data': { 'username': user.first_name } }, status=status.HTTP_200_OK)
        except:
            return Response({ 'status': False, 'msg': 'Error while loading user data' }, status=status.HTTP_403_FORBIDDEN)

# Used to fetch access_token from frontend; access_token required in frontend for playback control
@method_decorator(csrf_protect, name='dispatch')
class GetSpotifyAccess(APIView):

    def get(self, request, format=None):
        try:
            cache_handler = DjangoSessionCacheHandler(request=request)
            auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)
            
            token = auth_manager.get_access_token()

            return Response({ 'status': True, 'data': { 'token': token['access_token'], 'expires_in': (token['expires_at'] - int(time.time())) * 1000 } }, status=status.HTTP_200_OK)
        except:
            return Response({ 'status': False, 'msg': 'Error fetching the Spotify access token' }, status=status.HTTP_403_FORBIDDEN)



@method_decorator(csrf_protect, name='dispatch')
class LogOutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Successfully logged out' })
        except:
            return Response({ 'error': 'Error while logging out' })

class DeleteAccountView(APIView):
    def delete(self, request, format=None):

        try:
            user = self.request.user
            user = User.objects.filter(username=user.username).delete()
            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Error deleting user' })

@method_decorator(csrf_protect, name='dispatch')
class GetMoodVectorPreview(APIView):
    def post(self, request, format=None):
        vec_data = {}

        data = JSONParser().parse(request)
        vec_data['x_start'] = float(data.pop('scaledStartX'))
        vec_data['y_start'] = float(data.pop('scaledStartY'))
        vec_data['x_end'] = float(data.pop('scaledEndX'))
        vec_data['y_end'] = float(data.pop('scaledEndY'))
        
        try:
            previews = get_previews_for_vector(
                vec_data, request.user)

            return Response({'status': True,  'msg': 'Preview created successfull', 'data': previews})
        except Exception as e:
            print(e)
            return Response({'error': print(e)})

@method_decorator(csrf_protect, name='dispatch')
class SaveMoodVector(APIView):
    def post(self, request, format=None):
        # ToDo: Create Image
        img_path = 'test/path/to/image.png'

        data = JSONParser().parse(request)
        data['x_start'] = float(data.pop('scaledStartX'))
        data['y_start'] = float(data.pop('scaledStartY'))
        data['x_end'] = float(data.pop('scaledEndX'))
        data['y_end'] = float(data.pop('scaledEndY'))
        data['length'] = int(data.pop('length'))
        data['start_profile'] = data.pop('startProfile')
        data['end_profile'] = data.pop('endProfile')
        data['image_path'] = img_path #ToDo get from ccs
        data['user'] = request.user.id
        serializer = MoodVectorSerializer(data=data)


        if serializer.is_valid():
            print("serializer is valid.")
            mood_vector_instance = serializer.save()

            cache_handler = DjangoSessionCacheHandler(request=request)
            auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret,
                                        redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)

            auth_manager.get_access_token(self.request.GET.get("code"))
            spotify = spotipy.Spotify(auth_manager=auth_manager)
            
            playlist_url = create_playlist_for_vector(
                mood_vector_instance, request.user, spotify)
            mood_vector_instance.playlist_url = playlist_url
            mood_vector_instance.save()

            playlist_data = spotify.playlist(mood_vector_instance.playlist_url)
            
            # ToDo Trigger Recommendation / Playlist Creation
            return Response({ 'status': True, 'msg': 'Mood Vector successfully saved', 'playlist_uri':  mood_vector_instance.playlist_url, 'playlist_data': playlist_data }, status=status.HTTP_201_CREATED)
            
        return Response({'status': False, 'msg': serializer.errors})

@method_decorator(csrf_protect, name='dispatch')
class CreateSpotifyProfile(APIView):
    def get(self, request, format=None):
        cache_handler = DjangoSessionCacheHandler(request=request)
        auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret,
                                    redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)

        auth_manager.get_access_token(self.request.GET.get("code"))
        spotify = spotipy.Spotify(auth_manager=auth_manager)

        create_user_profile(request.user, spotify)

        return Response({ 'status': True, 'msg': 'User Profile created successfully'})


@method_decorator(csrf_protect, name='dispatch')
class GetPlaylistDummy(APIView):
    def get(self, request, format=None):
        
        cache_handler = DjangoSessionCacheHandler(request=request)
        auth_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret, redirect_uri=redirect_uri, scope=scope, cache_handler=cache_handler)
        spotify = spotipy.Spotify(auth_manager=auth_manager)
        data = spotify.playlist('37i9dQZF1DZ06evO2NufN6')

        return Response({ 'status': True, 'data': data }, status=status.HTTP_200_OK)

@method_decorator(csrf_protect, name='dispatch')
class GetUserProfiles(APIView):
    def get(self, request, format=None):
        
        clusters = get_user_profile_clusters(request.user)
        user_track_mappings = UserTrack.objects.filter(user = request.user, track__cluster__in = clusters)

        clusters_dict = {}

        for cluster in clusters:
            clusters_dict[cluster] = {'artists': [], 'genres': []}

        for user_track in user_track_mappings:
            track = user_track.track
            artists = [artist for artist in track.artists.split(',')]
            genres = [genre for genre in track.genres.split(',')]
            print(clusters_dict)
            for artist in artists:
                clusters_dict[track.cluster]['artists'].append(artist)

            for genre in genres:
                clusters_dict[track.cluster]['genres'].append(genre)

        for cluster in clusters:
            artists_list = clusters_dict[cluster]['artists']
            artists_dict = {x: artists_list.count(x) for x in artists_list}
            genres_list = clusters_dict[cluster]['genres']
            genres_dict = {x: genres_list.count(x) for x in genres_list}
            clusters_dict[cluster]['artists'] = dict(
                sorted(artists_dict.items(), key=lambda item: item[1], reverse=True))
            clusters_dict[cluster]['genres'] = dict(
                sorted(genres_dict.items(), key=lambda item: item[1], reverse=True))


        return Response({ 'status': True, 'data': clusters_dict }, status=status.HTTP_200_OK)