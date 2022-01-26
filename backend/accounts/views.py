import os
from accounts.serializers import MoodVectorSerializer
from spotify.services.recommender import create_playlist_for_vector, create_user_profile

from django.contrib import auth
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import DjangoSessionCacheHandler

# Create your views here.

scope = "user-read-email user-read-private user-top-read user-read-recently-played user-read-playback-position user-library-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"

client_id = os.environ.get('SPOTIFY_CLIENT_ID')
client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.environ.get('SPOTIFY_REDIRECT_URI')

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })

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

                # TODO: Solve password issue 
                password = "BASEPASSWORD1234s"
                boolea = False
                if not User.objects.filter(username=username).exists():
                    # Create User
                    user = User.objects.create_user(username=username, password=password, email=email)
                    user.save()
                    boolea = True
                # Sign User in
                user = auth.authenticate(username=username, password=password)
                auth.login(request, user)
                
                return HttpResponseRedirect(redirect_to="http://localhost:3000/")

            # Case 1: User initiates authentication and retrieves auth_url
            if not auth_manager.validate_token(cache_handler.get_cached_token()):
                auth_url = auth_manager.get_authorize_url()
                return Response({ 'auth_url': auth_url })

            # spotify = spotipy.Spotify(auth_manager=auth_manager)
        except Exception as e:
            print("----------------------------------")
            print(e)
            return HttpResponseRedirect(redirect_to="http://localhost:3000/error")
        # Case 3: User is already authenticated with Spotify 
        # return Response({ 'status': 'Success', 'me': spotify.me() })

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthentication(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            return Response({ 'status': True if request.session.get('_auth_user_id', 0) else False, 'msg': '' }, status=status.HTTP_200_OK)
        except:
            return Response({ 'error': 'Error checking authentication' })

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
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()
            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Error deleting user' })

@method_decorator(csrf_protect, name='dispatch')
class SaveMoodVector(APIView):
    def post(self, request, format=None):
        # ToDo: Create Image
        img_path = 'test/path/to/image.png'

        data = JSONParser().parse(request)
        data['x_start'] = data.pop('startX')
        data['y_start'] = data.pop('startY')
        data['x_end'] = data.pop('endX')
        data['y_end'] = data.pop('endY')
        data['image_path'] = img_path #ToDo get from ccs
        data['user'] = request.user.id
        serializer = MoodVectorSerializer(data=data)


        if serializer.is_valid():
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
            
            # ToDo Trigger Recommendation / Playlist Creation
            return Response({ 'status': True, 'msg': 'Mood Vector successfully saved', 'playlist_uri':  mood_vector_instance.playlist_url }, status=status.HTTP_201_CREATED)
            
        return Response({ 'status': False, 'msg': 'Error saving mood vector' })

@method_decorator(csrf_protect, name='dispatch')
class GetSpotifyAccess(APIView):
    def get(self, request, format=None):
        return Response({ 'status': True, 'token': request.session['token_info']}, status=status.HTTP_200_OK)

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