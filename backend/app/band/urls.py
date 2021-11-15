from django.urls import path
from band.views import (
    token_views,
    user_views,
    instrument_views,
    cover_views,
    combination_views,
    song_views,
)

urlpatterns = [
    path("token/", token_views.token, name="token"),
    # user urls
    path("user/signup/", user_views.UserSignup.as_view(), name="user_signup"),
    path("user/signin/", user_views.UserSignin.as_view(), name="user_signin"),
    path("user/signout/", user_views.UserSignout.as_view(), name="user_signout"),
    path("user/info/<int:id>/", user_views.UserInfo.as_view(), name="user_info"),
    # instrument urls
    path(
        "instrument/",
        instrument_views.InstrumentView.as_view({"get": "list"}),
        name="instrument",
    ),
    # cover urls
    path("cover/info/<int:id>/", cover_views.CoverInfo.as_view(), name="cover_info"),
    path("cover/like/<int:id>/", cover_views.CoverLike.as_view(), name="cover_like"),
    path(
        "cover/<int:songid>/<int:instrumentid>/",
        cover_views.CoverSongInstrument.as_view(),
        name="cover_song_instrument",
    ),
    path("cover/<int:songid>/", cover_views.CoverSong.as_view(), name="cover_song"),
    # combination urls
    path(
        "combination/info/<int:id>/",
        combination_views.CombinationInfo.as_view(),
        name="combination_info",
    ),
    path(
        "combination/like/<int:id>/",
        combination_views.CombinationLike.as_view(),
        name="combination_like",
    ),
    path(
        "combination/<int:songid>/",
        combination_views.CombinationSong.as_view(),
        name="combination_song",
    ),
    # song urls
    path("song/main/", song_views.SongMain.as_view(), name="song_main"),
    path("song/search/<str:key>/", song_views.SongSearch.as_view(), name="song_search"),
    path("song/info/<int:id>/", song_views.SongInfo.as_view(), name="song_info"),
    path("song/", song_views.SongView.as_view(), name="song"),
]
