""" band models
Django models for band
"""
import os
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField, IntegerField
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.contrib.auth import get_user_model


User = get_user_model()


class Instrument(models.Model):
    """Model for Instrument
    :type name: str
    :field name: The name of instrument
    """

    name: str = models.CharField(max_length=30, db_column="name")

    def __str__(self):
        return f"([{self.pk}] {self.name})"

    class Meta:
        db_table = "Instrument"


class Category(models.Model):
    """
    Model for Category
    :type name: str
    :field name: The name of category
    """

    name: str = models.CharField(max_length=30, db_column="name")

    def __str__(self):
        return f"([{self.pk}] {self.name})"

    class Meta:
        db_table = "Category"


class Song(models.Model):
    """Model for Song
    :field title: The title of this song
    :field singer: The singer of this song
    :field category: The genre of this song
    :field reference: Youtube link url of this song
    :field description: The description of this song
    """

    title: str = models.CharField(max_length=50, db_column="title")
    singer: str = models.CharField(max_length=50, db_column="singer")
    category: str = models.CharField(max_length=30, db_column="category")
    reference: str = models.CharField(max_length=255, db_column="reference")
    description: str = models.TextField(db_column="description", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"([{self.pk}] {self.title})"

    class Meta:
        db_table = "Song"


def cover_audio_path(instance, filename):
    print(f"{instance.title}/{instance.instrument_id}/{filename}")
    return f"cover_audio/{instance.song_id}/{instance.instrument_id}/{filename}"


class Cover(models.Model):
    """Model for Cover
    :field audio: The audio file of this cover
    :field title: The title of this cover
    :field category: The genre of this cover
    :field description: Youtube link url of this cover
    :field user: The 'User' of this cover
    :field instrument: The instrument played with.
    :field song: The 'Song' of this cover
    :field tags: The 'CoverTag's of this cover
    :field likes: The 'User's who likes this cover.
    :field view: The view count for this cover
    :field combination: The 'Combination' this cover was made to / null if there was no combination
    """

    audio = models.FileField(upload_to=cover_audio_path, editable=False)
    title: str = models.CharField(max_length=50, db_column="title")
    category: str = models.CharField(
        max_length=30,
        db_column="category",
    )
    description: str = models.TextField(db_column="description", blank=True)
    user: User = ForeignKey(
        User, related_name="covers", on_delete=models.SET_NULL, null=True
    )
    instrument: Instrument = ForeignKey(
        Instrument, related_name="+", on_delete=models.SET_NULL, null=True
    )
    song: Song = ForeignKey(Song, related_name="covers", on_delete=models.CASCADE)
    tags = ManyToManyField("CoverTag", db_table="Cover_Tags", blank=True)
    likes = ManyToManyField(
        User, db_table="Cover_Likes", related_name="like_covers", blank=True
    )
    view: int = IntegerField(db_column="view", default=0)
    combination: "Combination" = ForeignKey(
        "Combination",
        related_name="+",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def count_views(self) -> int:
        return CoverLog.objects.filter(cover=self).count()

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def __str__(self):
        return f"([{self.pk}] {self.title})"

    class Meta:
        db_table = "Cover"


class Combination(models.Model):
    """Combination model"""

    view: int = IntegerField(db_column="view", default=0)
    song: Song = ForeignKey(Song, related_name="combinations", on_delete=models.CASCADE)
    covers = ManyToManyField(Cover, db_table="Cover_Combination", related_name="+")
    likes = ManyToManyField(
        User, db_table="Combination_Likes", related_name="like_combinations", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def count_views(self) -> int:
        return CombinationLog.objects.filter(combination=self).count()

    @property
    def covers_count(self) -> int:
        return self.covers.count()

    def __str__(self):
        return f"([{self.pk}] {self.song} combination)"

    class Meta:
        db_table = "Combination"


class CoverTag(models.Model):
    """CoverTag model"""

    name: str = CharField(max_length=30, db_column="name", unique=True)

    class Meta:
        db_table = "CoverTag"


class CoverLog(models.Model):
    """CoverLog model"""

    addr = models.CharField(max_length=50, db_column="addr")
    user: User = ForeignKey(
        User, related_name="+", on_delete=models.SET_NULL, null=True
    )
    cover: Cover = ForeignKey(Cover, related_name="+", on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CoverLog"


class CombinationLog(models.Model):
    """CombinationLog model"""

    addr = models.CharField(max_length=50, db_column="addr")
    user: User = ForeignKey(
        User, related_name="+", on_delete=models.SET_NULL, null=True
    )
    combination: Combination = ForeignKey(Combination, on_delete=CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CombinationLog"


class RecoSong(models.Model):
    """RecoSong model
    load from s3 refresh every 6 hours"""

    song: Song = ForeignKey(Song, on_delete=models.CASCADE)
    recos = models.CharField(max_length=50, db_column="recos")

    class Meta:
        db_table = "RecoSong"


class CommentBase(models.Model):
    """CoverComment model"""

    user: User = ForeignKey(
        User, related_name="%(app_label)s_%(class)s_comments", on_delete=models.CASCADE
    )
    content = models.TextField(db_column="comment")
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = ManyToManyField(
        User,
        related_name="%(app_label)s_%(class)s_Likes",
        blank=True,
    )
    parent_comment = models.ForeignKey(
        "self",
        related_name="reply",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    @property
    def like_count(self) -> int:
        return self.likes.count()

    def __str__(self):
        return f"([{self.pk}] {self.user}'s comment)"

    class Meta:
        abstract = True


class CoverComment(CommentBase):
    """CoverComment model"""

    cover: Cover = ForeignKey(Cover, on_delete=models.CASCADE)

    class Meta:
        db_table = "CoverComment"


class SongComment(CommentBase):
    """SongComment model"""

    song: Song = ForeignKey(Song, on_delete=models.CASCADE)

    class Meta:
        db_table = "SongComment"


class CombinationComment(CommentBase):
    """CombinationComment model"""

    combination: Combination = ForeignKey(Combination, on_delete=models.CASCADE)

    class Meta:
        db_table = "CombinationComment"
