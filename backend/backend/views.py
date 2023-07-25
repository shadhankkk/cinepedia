from django.http import JsonResponse
from .models import Review, Profile, WatchlistItem
from .serializers import ReviewSerializer, UserSerializer, ProfileSerializer, WatchlistItemSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
from django.http import FileResponse

@api_view(['GET', 'POST'])
def review_list(request):
    
    if request.method == 'GET':
      reviews = Review.objects.all()
      serializer = ReviewSerializer(reviews, many=True)
      return JsonResponse(serializer.data, safe=False)
    
    if request.method == 'POST':
      serializer = ReviewSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data, status=status.HTTP_201_CREATED)
      
@api_view(['GET', 'POST', 'DELETE'])
def user_review_list(request, id):
    
    if request.method == 'GET':
      reviews = User.objects.get(username=id).review_set.all()
      serializer = ReviewSerializer(reviews, many=True)
      return JsonResponse(serializer.data, safe=False)
    
    if request.method == 'POST':
      serializer = ReviewSerializer(data=request.data)
      if serializer.is_valid():
         print(request.data)
         serializer.save()
         return Response(serializer.data)
   

@api_view(['GET', 'PUT', 'DELETE'])  
def review_detail(request, first_id, second_id):

  if request.method == 'GET':
    review = User.objects.get(username = first_id).review_set.get(movieId=second_id)#.values()
    print(review)
    serializer = ReviewSerializer(review)
    return JsonResponse(serializer.data, safe=False)
  elif request.method == 'PUT':
    serializer = ReviewSerializer(review, data=request.data)
    if serializer.is_valid:
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  elif request.method == 'DELETE':
     review = User.objects.get(username = first_id).review_set.get(movieId=second_id)
     review.delete()
     return Response(status=status.HTTP_204_NO_CONTENT)
  
@api_view(['GET'])
def film_review_list(request, id):
    
    if request.method == 'GET':
      reviews = Review.objects.all().filter(movieId = id)
      serializer = ReviewSerializer(reviews, many=True)
      return JsonResponse(serializer.data, safe=False)
    
@api_view(['GET', 'POST'])
def user_list(request):
    
    if request.method == 'GET':
      users = User.objects.all()
      serializer = UserSerializer(users, many=True)
      return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
      serializer = UserSerializer(data=request.data)
      print('hello world')
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
      
@api_view(['GET'])
def user_search_list(request, id):
   if request.method == 'GET':
      users = User.objects.filter(username__icontains = id)
      print(users)
      serializer = UserSerializer(users, many=True)
      return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def user_detail(request, id):
   
  if request.method == 'GET':
    user = User.objects.get(username=id)
    primKey = user.pk
    serializer = UserSerializer(user, many=False)
    serializer.data.update({'pk':primKey})
    
    if hasattr(user, 'profile'):
      pfp = user.profile.profilePicture
    else:
      pfp = ''

    reviews = list(user.review_set.all().values())
    watchlist = list(user.watchlistitem_set.all().values())
    print(watchlist)
    newData = {'username': serializer.data['username'], 'email': serializer.data['email'], 'password': serializer.data['password'], 'pk': primKey, 'pfp': str(pfp), 'reviews': reviews, 'watchlist': watchlist}
    return JsonResponse(newData, safe=False)
  
@api_view(['GET'])
def user_pk_detail(request, id):
   if request.method == 'GET':
      user = User.objects.get(pk=id)
      serializer = UserSerializer(user, many=False)
      return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def email_detail(request, id):
  if request.method == 'GET':
     user = User.objects.get(email=id)
     serializer = UserSerializer(user, many=False)
     return JsonResponse(serializer.data, safe=False)

@api_view(['GET', 'POST'])
def profile_list(request):
   if request.method == 'GET':
      profiles = Profile.objects.all()
      serializer = ProfileSerializer(profiles, many=True)
      return JsonResponse(serializer.data, safe=False)
   elif request.method == 'POST':
      serializer = ProfileSerializer(data=request.data)
      if serializer.is_valid():
         print('HOLA!!!')
         serializer.save()
         return Response(serializer.data)
      else:
         print('BYEsdsd!!!')
         print(serializer.errors)
         return Response(serializer.errors)
      
@api_view(['GET', 'PUT', 'POST'])
def user_profile(request, id):
   if request.method == 'GET':
      profile = Profile.objects.get(user = id)
      serializer = ProfileSerializer(profile, many=False)
      imgUrl = serializer.data['profilePicture']
      image_file_path = '.' + imgUrl
      
      return FileResponse(open(image_file_path, 'rb'), content_type='image/jpeg')
   if request.method == 'PUT':
      profile = Profile.objects.get(user = id)
      serializer = ProfileSerializer(profile, data=request.data)
      print(request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data)
   if request.method == 'POST':
      profile = User.objects.get(pk = id)
      serializer = ProfileSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data)
      
@api_view(['GET'])
def watchlist(request, id):
   if request.method == 'GET':
      watchlistItems = User.objects.get(username=id).watchlistitem_set.all()
      serializer = WatchlistItemSerializer(watchlistItems, many=True)
      return JsonResponse(serializer.data, safe=False)


@api_view(['GET', 'POST', 'DELETE'])
def watchlist_item(request, first_id, second_id):
   if request.method == 'GET':
      watchlistItem = User.objects.get(username=first_id).watchlistitem_set.get(movieId = second_id)
      serializer = WatchlistItemSerializer(watchlistItem, many=False)
      return JsonResponse(serializer.data, safe=False)
   elif request.method == 'POST':
      print(request.data)
      serializer = WatchlistItemSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data)
   elif request.method == 'DELETE':
      watchlistItem = User.objects.get(username=first_id).watchlistitem_set.get(movieId = second_id)
      watchlistItem.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)