import os

from django.contrib.auth.models import User
from django.http import response
from django.shortcuts import redirect, render
from requests.models import Response
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.response import Response
from requests import Request, post
from rest_framework.permissions import AllowAny

from .util import is_spotify_authenticated, update_or_create_user_token
from backend.serializers import UserSerializer

# Create your views here.
class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': os.environ.get('SPOTIFY_REDIRECT_URI'),
            'client_id': os.environ.get('SPOTIFY_CLIENT_ID')
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    # user = request.user
    user = User.objects.get(id = 1)

    response = post('https://accounts.spotify.com/api/token', data= {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': os.environ.get('SPOTIFY_REDIRECT_URI'),
        'client_id': os.environ.get('SPOTIFY_CLIENT_ID'),
        'client_secret': os.environ.get('SPOTIFY_CLIENT_SECRET')
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    update_or_create_user_token(user, access_token, token_type, expires_in, refresh_token)

    return redirect('http://localhost:3000/')

class Is_Authenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny, )