from django.urls import path, include
from django.contrib import admin
from django.contrib.auth.models import User
from rest_framework import serializers, views, viewsets, routers
from rest_framework.authtoken import views
from spotify.views import UserCreate

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Routers provide a way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('spotify/', include('spotify.urls')),
    # AUTHENTICATION
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-auth/login/', views.obtain_auth_token, name='api-token-auth'),
    path('api-auth/register/', UserCreate.as_view())
]