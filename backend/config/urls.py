from django.contrib import admin
from django.urls import path, re_path

from imdb import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('download/', views.download_title_basics),
    # path('show/<str:id>/', views.get_show),
    path('ratings/<str:id>/<int:season>/', views.get_season_ratings)
]
