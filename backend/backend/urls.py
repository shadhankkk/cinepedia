"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('reviews/', views.review_list),
    path('<str:first_id>/reviews/<str:second_id>', views.review_detail),
    path('reviews/film/<str:id>/', views.film_review_list),
    path('users/', views.user_list),
    path('users/<int:id>/profile', views.user_profile),
    path('<str:id>/reviews', views.user_review_list),
    path('users_search/<str:id>', views.user_search_list),
    path('users/<str:id>', views.user_detail),
    path('users/pk/<int:id>', views.user_pk_detail),
    path('email/<str:id>', views.email_detail),
    path('profiles/', views.profile_list),
    path('<str:id>/watchlist', views.watchlist),
    path('<str:first_id>/watchlist/<str:second_id>', views.watchlist_item),
]
