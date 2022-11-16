""" User serializers
DRF serializers for user
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from common.proxy_file_field import ProxyFileField

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user basic info"""

    photo = ProxyFileField(allow_empty_file=True)

    class Meta:
        extra_fields = []
        model = User
        # if hasattr(User, "email"):
        #     extra_fields.append("email")
        if hasattr(User, "username"):
            extra_fields.append("username")
        if hasattr(User, "photo"):
            extra_fields.append("photo")
        # if hasattr(User, "last_name"):
        #     extra_fields.append("last_name")
        # if hasattr(User, "first_name"):
        #     extra_fields.append("first_name")
        fields = ("id", *extra_fields)
        read_only_fields = ("email",)
