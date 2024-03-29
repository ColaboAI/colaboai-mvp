"""Band urls
Urls for band
"""

from django.urls import path
from band.views import (
    token_views,
    instrument_views,
    cover_views,
    combination_views,
    song_views,
    log_views,
    comment_views,
    category_views,
)

urlpatterns = [
    path("token/", token_views.token, name="token"),
    # instrument urls
    path(
        "instrument/",
        instrument_views.InstrumentView.as_view({"get": "list"}),
        name="instrument",
    ),
    # category urls
    path(
        "category/",
        category_views.CategoryViews.as_view({"get": "list"}),
        name="category",
    ),
    # cover urls
    path("cover/info/<int:pk>/", cover_views.CoverInfo.as_view(), name="cover_info"),
    path("cover/like/<int:pk>/", cover_views.CoverLike.as_view(), name="cover_like"),
    path(
        "cover/<int:song_id>/<int:instrument_id>/",
        cover_views.CoverSongInstrument.as_view(),
        name="cover_song_instrument",
    ),
    path("cover/<int:song_id>/", cover_views.CoverSong.as_view(), name="cover_song"),
    # combination urls
    path(
        "combination/main/",
        combination_views.CombinationMain.as_view(),
        name="combination_main",
    ),
    path(
        "combination/info/<int:pk>/",
        combination_views.CombinationInfo.as_view(),
        name="combination_info",
    ),
    path(
        "combination/like/<int:pk>/",
        combination_views.CombinationLike.as_view(),
        name="combination_like",
    ),
    path(
        "combination/<int:song_id>/",
        combination_views.CombinationSong.as_view(),
        name="combination_song",
    ),
    # song urls
    path("song/search/", song_views.SongSearch.as_view(), name="song_search"),
    path("song/info/<int:pk>/", song_views.SongInfo.as_view(), name="song_info"),
    path("song/", song_views.SongView.as_view(), name="song"),
    # Log urls
    path("log/cover/", log_views.CoverLogsView.as_view(), name="log_cover"),
    path(
        "log/combination/",
        log_views.CombinationLogsView.as_view(),
        name="log_combination",
    ),
    # Commnet urls
    path(
        "cover/<int:cover_id>/comment/",
        comment_views.CoverCommentView.as_view(),
        name="cover_comment",
    ),
    path(
        "cover/<int:cover_id>/comment/<int:pk>/",
        comment_views.CoverCommentInfoView.as_view(),
        name="cover_comment_info",
    ),
    path(
        "combination/<int:combination_id>/comment/",
        comment_views.CombinationCommentView.as_view(),
        name="combination_comment",
    ),
    path(
        "combination/<int:combination_id>/comment/<int:pk>/",
        comment_views.CombinationCommentInfoView.as_view(),
        name="combination_comment_info",
    ),
    path(
        "song/<int:song_id>/comment/",
        comment_views.SongCommentView.as_view(),
        name="song_comment",
    ),
    path(
        "song/<int:song_id>/comment/<int:pk>/",
        comment_views.SongCommentInfoView.as_view(),
        name="song_comment_info",
    ),
]
