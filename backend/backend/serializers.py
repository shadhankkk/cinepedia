from rest_framework import serializers
from .models import Review, Profile, WatchlistItem
from django.contrib.auth.models import User

class ReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Review
        fields = ['id', 'movieId', 'author', 'rating', 'title', 'review']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class ProfileSerializer(serializers.ModelSerializer):
    profilePicture = serializers.ImageField(use_url=True)

    class Meta:
        model = Profile
        fields = ['user', 'profilePicture']

class WatchlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = ['user', 'movieId']