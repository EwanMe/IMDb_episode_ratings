from django.contrib import admin
from django.urls import path

from imdb import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "download/<str:table>/",
        views.populate_database,
        name="download_single",
    ),
    path("download/", views.populate_database),
    path("show/<str:id>/", views.get_show),
    path("ratings/<str:id>/", views.get_episode_ratings),
    path("search/", views.get_free_search),
]
