from django.contrib import admin
from django.urls import path

from imdb import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("show/<str:id>/", views.get_show),
    path("ratings/<str:id>/", views.get_episode_ratings),
    path("search/", views.get_free_search),
]
