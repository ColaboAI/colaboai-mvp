""" User views
views for user
"""
import json
from json.decoder import JSONDecodeError

import requests
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.kakao.views import KakaoOAuth2Adapter
from allauth.socialaccount.providers.naver.views import NaverOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from band.models import Instrument
from bandcruit.settings import get_secret
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.social_serializers import TwitterLoginSerializer
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.http.request import HttpRequest
from django.shortcuts import redirect
from django.db import IntegrityError
from rest_framework import generics, mixins, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserFollowing
from .serializers import UserFollowingSerializer, UserProfileSerializer
from dj_rest_auth.jwt_auth import JWTCookieAuthentication

"""
TODO:
1. 유저 프로필 정보 업데이트 소셜 로그인 할떄 -> 시리얼라이저 수정
"""

User = get_user_model()

BASE_URL = "http://localhost:8000/api/"
GOOGLE_CALLBACK_URI = BASE_URL + "accounts/google/callback/"
KAKAO_CALLBACK_URI = BASE_URL + "accounts/kakao/callback/"
NAVER_CALLBACK_URI = BASE_URL + "accounts/naver/callback/"
state = get_secret("STATE")


class UserFollowingView(mixins.ListModelMixin, generics.GenericAPIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = UserFollowingSerializer
    queryset = UserFollowing.objects.all()
    authentication_classes = (JWTCookieAuthentication,)

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            pk = kwargs["pk"]
            self.queryset = UserFollowing.objects.filter(user_to__id=pk)
            return self.list(request)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request: Request, *args, **kwargs) -> Response:
        try:
            pk = kwargs["pk"]
            user = User.objects.get(pk=pk)
            if pk == request.user.pk:
                return JsonResponse(
                    {"err_msg": "Can not follow yourself."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            data = {"user_from": request.user.pk, "user_to": pk}
            serializer = UserFollowingSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user_from=request.user, user_to=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return JsonResponse(
                {"err_msg": "Fail to follow. User Does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except IntegrityError:
            return JsonResponse(
                {"err_msg": "Already following."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request: HttpRequest, *args, **kwargs):
        try:
            pk = kwargs["pk"]
            user_to = User.objects.get(pk=pk)
            user_from = request.user

            data = {"user_from": user_from.pk, "user_to": user_to.pk}
            q = UserFollowing.objects.filter(**data)
            if q.exists():
                q.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return JsonResponse(
                    {"err_msg": "Fail to unfollow. You are not following this user."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except User.DoesNotExist:
            return JsonResponse(
                {"err_msg": "Fail to unfollow. User Does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )


class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, *args, **kwargs):
        self.object = confirmation = self.get_object()
        confirmation.confirm(self.request)
        # A React Router Route will handle the failure scenario
        return HttpResponseRedirect("/")

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        email_confirmation = EmailConfirmationHMAC.from_key(key)
        if not email_confirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                email_confirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                # A React Router Route will handle the failure scenario
                return JsonResponse(
                    {"err_msg": "failed to confirm email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return email_confirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs


def google_login(request):
    """
    Code Request
    """
    scope = "openid email profile"
    client_id = get_secret("SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    return redirect(
        f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={GOOGLE_CALLBACK_URI}&scope={scope}"
    )


def google_callback(request):
    client_id = get_secret("SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    client_secret = get_secret("SOCIAL_AUTH_GOOGLE_SECRET")
    code = request.GET.get("code")
    """
    Access Token Request
    """
    token_req = requests.post(
        f"https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}"
    )
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    error_des = token_req_json.get("error_description")
    if error is not None:
        raise JSONDecodeError(msg=error_des, doc=error, pos=0)
    access_token = token_req_json.get("access_token")
    """
    Email Request
    """
    email_req = requests.get(
        f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
    )
    email_req_status = email_req.status_code
    if email_req_status != 200:
        return JsonResponse(
            {"err_msg": "failed to get email"}, status=status.HTTP_400_BAD_REQUEST
        )
    email_req_json = email_req.json()
    email = email_req_json.get("email")
    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # 기존에 가입된 유저의 Provider가 google이 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)

        if social_user.provider != "google":
            return JsonResponse(
                {"err_msg": "no matching social type"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # 기존에 Google로 가입된 유저
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/google/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signin"}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/google/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signup"}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)

    except SocialAccount.DoesNotExist:
        # 이메일은 있지만 SocialAccount가 없는 경우
        return JsonResponse(
            {"err_msg": "email exists but not social user"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class GoogleLogin(
    SocialLoginView
):  # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = GOOGLE_CALLBACK_URI
    client_class = OAuth2Client


def kakao_login(request):
    rest_api_key = get_secret("KAKAO_REST_API_KEY")
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={rest_api_key}&redirect_uri={KAKAO_CALLBACK_URI}&response_type=code"
    )


def kakao_callback(request):
    rest_api_key = get_secret("KAKAO_REST_API_KEY")
    code = request.GET.get("code")
    redirect_uri = KAKAO_CALLBACK_URI
    """
    Access Token Request
    """
    token_req = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}"
    )
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    error_des = token_req_json.get("error_description")
    if error is not None:
        raise JSONDecodeError(msg=error_des, doc=error, pos=0)
    access_token = token_req_json.get("access_token")
    """
    Email Request
    """
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    profile_json = profile_request.json()
    kakao_account = profile_json.get("kakao_account")
    """
    kakao_account에서 이메일 외에
    카카오톡 프로필 이미지, 배경 이미지 url 가져올 수 있음
    print(kakao_account) 참고
    """
    # print(kakao_account)
    email = kakao_account.get("email")
    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)

        if social_user.provider != "kakao":
            return JsonResponse(
                {"err_msg": "no matching social type"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # 기존에 카카오로 가입된 유저
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signin"}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signup"}, status=accept_status)
        # user의 pk, email, first name, last name과 Access Token, Refresh token 가져옴
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)
    except SocialAccount.DoesNotExist:
        # 이메일은 있지만 SocialAccount가 없는 경우
        return JsonResponse(
            {"err_msg": "email exists but not social user"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class KakaoLogin(SocialLoginView):
    adapter_class = KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = KAKAO_CALLBACK_URI


def naver_login(request):
    client_id = get_secret("SOCIAL_AUTH_NAVER_CLIENT_ID")
    return redirect(
        f"https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id={client_id}&state={state}&redirect_uri={NAVER_CALLBACK_URI}"
    )


def naver_callback(request):
    client_id = get_secret("SOCIAL_AUTH_NAVER_CLIENT_ID")
    client_secret = get_secret("SOCIAL_AUTH_NAVER_SECRET")
    code = request.GET.get("code")
    state_string = request.GET.get("state")

    # code로 access token 요청
    token_request = requests.get(
        f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={client_id}&client_secret={client_secret}&code={code}&state={state_string}"
    )
    token_response_json = token_request.json()

    error = token_response_json.get("error", None)
    error_des = token_response_json.get("error_description")
    if error is not None:
        raise JSONDecodeError(msg=error_des, doc=error, pos=0)

    access_token = token_response_json.get("access_token")

    # return JsonResponse({"access_token":access_token})

    # access token으로 네이버 프로필 요청
    profile_request = requests.post(
        "https://openapi.naver.com/v1/nid/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    profile_json = profile_request.json()
    email = profile_json.get("email")
    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # 기존에 가입된 유저의 Provider가 naver가 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)

        if social_user.provider != "naver":
            return JsonResponse(
                {"err_msg": "no matching social type"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 기존에 네이버로 가입된 유저
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/naver/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signin"}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {"access_token": access_token, "code": code}
        accept = requests.post(f"{BASE_URL}accounts/naver/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({"err_msg": "failed to signup"}, status=accept_status)
        # user의 pk, email, first name, last name과 Access Token, Refresh token 가져옴
        accept_json = accept.json()
        accept_json.pop("user", None)
        return JsonResponse(accept_json)

    except SocialAccount.DoesNotExist:
        # User는 있는데 SocialAccount가 없을 때 (=일반회원으로 가입된 이메일일때)
        return JsonResponse(
            {"err_msg": "email exists but not social user"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class NaverLogin(SocialLoginView):
    adapter_class = NaverOAuth2Adapter
    client_class = OAuth2Client
    callback_url = NAVER_CALLBACK_URI


class TwitterLogin(SocialLoginView):
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class UserInfo(
    mixins.RetrieveModelMixin,
    generics.GenericAPIView,
):
    """user/info/<pk>"""

    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class MyInfo(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    """user/me/"""

    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def get_object(self):
        return self.request.user

    def get(self, request: HttpRequest, *args, **kwargs):

        return self.retrieve(request, *args, **kwargs)

    def post(self, request: HttpRequest, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        print("Before serializer is valid : ", request.data)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save()

        instrument_list = request.data.get("instruments")
        if instrument_list is not None:
            try:
                instrument_list = json.loads(instrument_list)
                instruments = Instrument.objects.filter(id__in=instrument_list)
                new_user.instruments.set(instruments)
            except JSONDecodeError:
                return Response("instrument format not json", 400)

        return Response(UserProfileSerializer(new_user).data)

    def delete(self, request: HttpRequest, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
