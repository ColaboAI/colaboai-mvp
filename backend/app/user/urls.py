"""Band urls
Urls for user
"""

from django.urls import include, path, re_path
from user import views
from dj_rest_auth.registration.views import VerifyEmailView

urlpatterns = [
    path("signup/", views.UserSignup.as_view(), name="user_signup"),
    path("signin/", views.UserSignin.as_view(), name="user_signin"),
    path("signout/", views.UserSignout.as_view(), name="user_signout"),
    path("info/<int:pk>/", views.UserInfo.as_view(), name="user_info"),
    path("", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
    # path("facebook/", views.FacebookLogin.as_view(), name="fb_login"),
    # path("twitter/", views.TwitterLogin.as_view(), name="twitter_login"),
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
    path("naver/login/", views.naver_login, name="naver_login"),
    path("naver/callback/", views.naver_callback, name="naver_callback"),
    path(
        "naver/login/finish/", views.NaverLogin.as_view(), name="naver_login_todjango"
    ),
    re_path(
        r"^account-confirm-email/$",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    # 유저가 클릭한 이메일(=링크) 확인
    re_path(
        r"^account-confirm-email/(?P<key>[-:\w]+)/$",
        views.ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
]
