from django.contrib import admin
from .models import Review, Profile, WatchlistItem

admin.site.register(Review)
admin.site.register(Profile)
admin.site.register(WatchlistItem)