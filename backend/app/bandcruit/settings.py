"""
Django settings for bandcruit project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

from datetime import timedelta
import os
import json
from json.decoder import JSONDecodeError
from pathlib import Path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

schema_view = get_schema_view(
    openapi.Info(
        title="Swagger Study API",
        default_version="v1",
        description="Swagger Study를 위한 API 문서",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(name="test", email="test@test.com"),
        license=openapi.License(name="Test License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: Get secret key from secrets.json file
secret_file = os.path.join(BASE_DIR, "secrets.json")
try:
    with open(secret_file, encoding="utf8") as f:
        secrets = json.loads(f.read())
except (FileNotFoundError, JSONDecodeError):
    secrets = {}


def get_secret(setting, fallback="asdsad"):
    try:
        return secrets[setting]
    except KeyError:
        return fallback


SECRET_KEY = get_secret("SECRET_KEY", "ASDFG")


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = get_secret("DEBUG", True) == "True"

ALLOWED_HOSTS = get_secret("ALLOWED_HOSTS", ["localhost", "127.0.0.1"])


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "django_apscheduler",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "band",
    "user",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "rest_framework_simplejwt",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.twitter",
    "allauth.socialaccount.providers.facebook",
    "allauth.socialaccount.providers.kakao",
    "allauth.socialaccount.providers.naver",
    "storages",  # for S3, django-storages
    "drf_yasg",  # swagger
    # "debug_toolbar",
]

APSCHEDULER_DATETIME_FORMAT = "N j, Y, f:s a"  # Default

SCHEDULER_DEFAULT = True

# Use Custom User as default user
AUTH_USER_MODEL = "user.CustomUser"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_USERNAME_BLACKLIST = ["admin", "master", "colaboai"]
SITE_ID = 1

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = get_secret("EMAIL_HOST")  # 메일 호스트 서버
EMAIL_PORT = get_secret("EMAIL_PORT")  # gmail과 통신하는 포트
EMAIL_HOST_USER = get_secret("EMAIL_HOST_USER")  # email 계정

EMAIL_HOST_PASSWORD = get_secret("EMAIL_HOST_PASSWORD")  # 발신할 메일의 비밀번호

EMAIL_USE_TLS = True  # TLS 보안 방법

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

URL_FRONT = "colabo.ml"  # 공개적인 웹페이지가 있다면 등록

ACCOUNT_CONFIRM_EMAIL_ON_GET = True  # 유저가 받은 링크를 클릭하면 회원가입 완료되게끔
ACCOUNT_EMAIL_REQUIRED = True
# TODO: 이메일 인증을 통해 회원가입을 완료하게끔?
ACCOUNT_EMAIL_VERIFICATION = "none"  # "mandatory"

EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = "/"  # 이메일 인증 후 리다이렉트할 페이지

ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1

# 이메일에 자동으로 표시되는 사이트 정보
ACCOUNT_EMAIL_SUBJECT_PREFIX = "colaobAI"
# To use Auto Field id
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # "debug_toolbar.middleware.DebugToolbarMiddleware",
]
INTERNAL_IPS = [
    "127.0.0.1",
]

ROOT_URLCONF = "bandcruit.urls"

CSRF_TRUSTED_ORIGINS = [
    "https://www.colabo.ml/*",
    "colabo.ml/*",
    "http://localhost",
    "colabo.ml",
    "localhost",
]
CORS_ORIGIN_WHITELIST = [
    "https://www.colabo.ml",
    "https://colabo.ml",
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "bandcruit.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
if get_secret("DATABASES") is not None:
    DATABASES = get_secret("DATABASES")
else:
    DATABASES = {
        "default": {
            "ENGINE": get_secret("DB_ENGINE", "django.db.backends.sqlite3"),
            "NAME": get_secret("SQL_DATABASE", BASE_DIR / "db.sqlite3"),
            "USER": get_secret("SQL_USER", "band"),
            "PASSWORD": get_secret("SQL_PASSWORD", "dlrjsqlalf"),
            "HOST": get_secret("HOST", "mysql.db"),
            "PORT": os.environ.get("SQL_PORT", "3306"),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

USE_S3 = get_secret("USE_S3", "False") == "True"
if USE_S3:
    # aws settings
    AWS_ACCESS_KEY_ID = get_secret("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = get_secret("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = get_secret("AWS_STORAGE_BUCKET_NAME")
    AWS_DEFAULT_ACL = "public-read"
    AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
    AWS_S3_OBJECT_PARAMETERS = {
        "ACL": "public-read",
        "CacheControl": "max-age=86400",
    }
    STATIC_LOCATION = "static"
    # STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/"
    # STATICFILES_STORAGE = "hello_django.storage_backends.StaticStorage"
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = "media"
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/"
    DEFAULT_FILE_STORAGE = "band.storage_backends.PublicMediaStorage"

    # 개발용 임시 static local
    STATIC_URL = "/static/"
    STATIC_ROOT = os.path.join(BASE_DIR, "static")

else:
    STATIC_URL = "/static/"
    STATIC_ROOT = os.path.join(BASE_DIR, "static")
    MEDIA_URL = "/media/"
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_FILE_STORAGE = "band.storage_backends.PublicMediaStorage"
# STATICFILES_STORAGE = "band.storage_backends.StaticStorage"
# STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),)


# maximum file upload size: currently 15MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 15728640

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly"
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
    # "TEST_REQUEST_DEFAULT_FORMAT": "json",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
}
# TODO: uncomment this in production
# JWT_AUTH_SECURE = True
REST_USE_JWT = True
REST_SESSION_LOGIN = False
JWT_AUTH_HTTPONLY = True
JWT_AUTH_REFRESH_COOKIE = "colaboai-refresh-token"

# For https header
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

REST_AUTH_SERIALIZERS = {
    "USER_DETAILS_SERIALIZER": "user.serializers.UserSerializer",
}

REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "user.serializers.CustomRegisterSerializer",
}

# TODO: 회원가입시 refresh 토큰 반환되는것 수정하기.
AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
)
