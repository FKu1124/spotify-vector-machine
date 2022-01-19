from django.urls import path
from accounts.views import LoginWithSpotify, GetCSRFToken, CheckAuthentication, LogOutView, DeleteAccountView, SaveMoodVector

urlpatterns = [
    # Auth Endpoints
    path('get_csrf_token', GetCSRFToken.as_view()),
    path('check_authentication', CheckAuthentication.as_view()),
    path('logout', LogOutView.as_view()),
    path('delete', DeleteAccountView.as_view()),
    path('loginwithspotify', LoginWithSpotify.as_view()),

    # Mood Vector Endpoints
    path('save_vector', SaveMoodVector.as_view())
]
