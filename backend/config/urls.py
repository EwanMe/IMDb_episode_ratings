from django.contrib import admin
from django.urls import path

from imdb import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('download/', views.download_title_basics)
]
