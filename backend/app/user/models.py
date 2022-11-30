""" user models
Make custom user model for bandcruit
"""
import os.path

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager


# TODO: https://stackoverflow.com/questions/68889451/how-to-optimize-django-application-for-images-and-static-files
# Image size optimization
def user_profile_path(instance, filename):
    return f"profile_pic/{instance.pk}/{filename}"


class CustomUser(AbstractUser):
    """Custom user model class for bandcruit
    Remove :
        `first_name`
        `last_name`
    Add :
        `description`: Bio of this user
        `photo`: Profile image
        `followings`: User can follow the other users. (related_name: `followers`)
        `instruments`: Instruments user can play.
    """

    username = models.CharField(max_length=64, db_column="Username", default="")
    email = models.EmailField(
        _("email address"), unique=True, max_length=254, editable=False
    )
    first_name = None
    last_name = None
    description = models.TextField(db_column="description", default="", blank=True)
    photo = models.ImageField(upload_to=user_profile_path, default=None)
    # followings = models.ManyToManyField(
    #     "CustomUser",
    #     related_name="followers",
    #     db_table="User_Following",
    #     blank=True,
    #     symmetrical=False,
    # )
    instruments = models.ManyToManyField(
        "band.Instrument", related_name="+", db_table="User_Instruments", blank=True
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"([{self.id}] {self.email})"

    def count_followers(self):
        return self.followers.count()

    def count_following(self):
        return self.followings.count()

    class Meta:
        db_table = "User"


class UserFollowing(models.Model):
    """User following model class for colaboai
    This model is used for user following
    """

    user_from = models.ForeignKey(
        "CustomUser",
        on_delete=models.CASCADE,
        related_name="following",
        null=False,
    )
    user_to = models.ForeignKey(
        "CustomUser",
        on_delete=models.CASCADE,
        related_name="follower",
        null=False,
    )
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "UserFollowing"
        constraints = [
            models.UniqueConstraint(
                fields=["user_from_id", "user_to_id"], name="unique_following"
            )
        ]
        ordering = ["-created"]

    def __str__(self):
        f"{self.user_from.id} follows {self.user_to.id}"
