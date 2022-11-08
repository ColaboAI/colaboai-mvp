"""Band urls
Urls for user
"""

from django.urls import include, path
from user.views import FacebookLogin, TwitterLogin, GoogleLogin
from user import views

urlpatterns = [
    path("signup/", views.UserSignup.as_view(), name="user_signup"),
    path("signin/", views.UserSignin.as_view(), name="user_signin"),
    path("signout/", views.UserSignout.as_view(), name="user_signout"),
    path("info/<int:pk>/", views.UserInfo.as_view(), name="user_info"),
    path("", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
    path("facebook/", FacebookLogin.as_view(), name="fb_login"),
    path("twitter/", TwitterLogin.as_view(), name="twitter_login"),
    path("google/login/", views.google_login, name="google_login"),
    path("google/callback/", views.google_callback, name="google_callback"),
    path(
        "google/login/finish/",
        views.GoogleLogin.as_view(),
        name="google_login_todjango",
    ),
    path("kakao/login/", views.kakao_login, name="kakao_login"),
    path("kakao/callback/", views.kakao_callback, name="kakao_callback"),
    path(
        "kakao/login/finish/", views.KakaoLogin.as_view(), name="kakao_login_todjango"
    ),
]
