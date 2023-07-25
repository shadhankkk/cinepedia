from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from django.contrib.postgres.fields import ArrayField

class Review(models.Model):
    movieId = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    review = models.CharField(max_length=10000)
    rating = models.IntegerField()

    def __str__(self):
        return self.title
    
class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movieId = models.CharField(max_length=100)
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profilePicture = models.ImageField(default='backend/images/default_pfp.jpg', upload_to='backend/images')

    def __str__(self):
        return f'{self.user.username} Profile'
    
    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)

        img = Image.open(self.profilePicture.path)

        if img.height >= 300 or img.width >= 300:
            output_size = (300,300)
            img.thumbnail(output_size)
            img.save(self.profilePicture.path)