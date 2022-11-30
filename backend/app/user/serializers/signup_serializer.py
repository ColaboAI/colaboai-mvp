from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.db import transaction


class CustomRegisterSerializer(RegisterSerializer):
    tos_agreement = serializers.BooleanField(required=True)
    privacy_agreement = serializers.BooleanField(required=True)
    marketing_agreement = serializers.BooleanField(required=True)

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.tos_agreement = self.data.get("tos_agreement")
        user.privacy_agreement = self.data.get("privacy_agreement")
        user.marketing_agreement = self.data.get("marketing_agreement")
        user.save()
        return user
