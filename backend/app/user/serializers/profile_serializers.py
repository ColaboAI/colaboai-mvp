""" User serializers
DRF serializers for user
"""

from band.serializers import CoverSerializer, InstrumentSerializer
from common.proxy_file_field import ProxyFileField
from django.contrib.auth import get_user_model
from rest_framework import serializers
from user.models import UserFollowing
from user.serializers import UserSerializer

# import Event

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user"""

    instruments = InstrumentSerializer(many=True, read_only=True)
    following = serializers.SerializerMethodField()
    follower = serializers.SerializerMethodField()
    photo = ProxyFileField(allow_empty_file=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "description",
            "photo",
            "following",
            "follower",
            "instruments",
        ]

    def get_following(self, obj):
        return obj.following.count()

    def get_follower(self, obj):
        return obj.follower.count()


class UserFollowingSerializer(serializers.ModelSerializer):
    """Serializer for user follow View"""

    user_from = UserSerializer(read_only=True)
    user_to = UserSerializer(read_only=True)

    class Meta:
        model = UserFollowing
        fields = "__all__"


class FollowingSerializer(serializers.ModelSerializer):
    """Serializer for user following"""

    class Meta:
        model = UserFollowing
        fields = (
            "id",
            "user_to",
        )


class FollowerSerializer(serializers.ModelSerializer):
    """Serializer for user follower"""

    class Meta:
        model = UserFollowing
        fields = (
            "id",
            "user_from",
        )
