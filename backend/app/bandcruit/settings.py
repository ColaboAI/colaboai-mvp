"""
Django settings for bandcruit project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import os
import json
from json.decoder import JSONDecodeError
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: Get secret key from secrets.json file
secret_file = os.path.join(BASE_DIR, "secrets.json")
try:
    with open(secret_file, encoding="utf8") as f:
        secrets = json.loads(f.read())
except (FileNotFoundError, JSONDecodeError):
    secrets = {}


def get_secret(setting, fallback):
    try:
        return secrets[setting]
    except KeyError:
        return fallback


SECRET_KEY = get_secret("SECRET_KEY", "ASDFG")


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = get_secret("DEBUG", False)

ALLOWED_HOSTS = get_secret("ALLOWED_HOSTS", [])


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "band",
    "user",
]


# Use Custom User as default user
AUTH_USER_MODEL = "user.CustomUser"


# To use Auto Field id
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "bandcruit.urls"

CORS_ORIGIN_WHITELIST = ["http://www.metaband.space", "http://localhost"]

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
DATABASES = {
    "default": {
        "ENGINE": get_secret("DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": get_secret("SQL_DATABASE", BASE_DIR / "db.sqlite3"),
        "USER": get_secret("SQL_USER", "band"),
        "PASSWORD": get_secret("SQL_PASSWORD", "dlrjsqlalf"),
        "HOST": "mysql.db",
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

STATIC_URL = "/static/"

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

# maximum file upload size: currently 15MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 15728640

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly"
    ],
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}
