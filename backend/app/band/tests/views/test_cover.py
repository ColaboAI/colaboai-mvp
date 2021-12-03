"""
Test codes for band cover
"""
import json
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client
from rest_framework import status
from band.models import Cover, CoverTag, Instrument, Song
from band.tests.tools import set_up_data
from user.models import CustomUser

User = get_user_model()


class CoverTestCase(TestCase):
    """
    TestCase Class for band app's cover view
    """

    @classmethod
    def setUpClass(cls):
        super(CoverTestCase, cls).setUpClass()
        set_up_data()

    def test_cover_song_get(self):
        client = Client(enforce_csrf_checks=False)

        song: Song = Song.objects.get(pk=1)

        response = client.get(f"/api/cover/{song.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        covers = json.loads(response.content)
        self.assertGreater(len(covers), 0)

    def test_cover_song_post(self):
        client = Client(enforce_csrf_checks=False)
        user: CustomUser = User.objects.get(pk=1)
        client.force_login(user)

        song: Song = Song.objects.get(pk=1)
        last_song: Song = Song.objects.all().order_by("-id").first()
        tag: CoverTag = CoverTag.objects.get(pk=1)

        # cover song with bad song number
        response = client.post(
            f"/api/cover/{last_song.pk + 1}/",
            {},
            content_type="form/data",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # cover song post with valid data
        tags = json.dumps([tag.name])
        audio = SimpleUploadedFile(
            "file.mp3", "file_content", content_type="audio/mpeg"
        )
        print(json.dumps([tag.name]))
        response = client.post(
            f"/api/cover/{song.pk}/",
            {
                "audio": audio,
                "title": "TEST_TITLE",
                "description": "TEST_DESCRIPTION",
                "instrument": 1,
                "tags": tags,
            },
            content_type="form/data",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response.content)

    def test_cover_song_instrument(self):
        client = Client(enforce_csrf_checks=False)
        song: Song = Song.objects.get(pk=1)
        cover: Cover = Cover.objects.filter(song_id=song.pk).first()
        instrument: Instrument = cover.instrument

        response = client.get(f"/api/cover/{song.pk}/{instrument.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        covers = json.loads(response.content)
        self.assertGreater(len(covers), 0)

    def test_cover_like(self):
        client = Client(enforce_csrf_checks=False)

        cover: Cover = Cover.objects.first()
        last_cover: Cover = Cover.objects.all().order_by("-id").first()

        response = client.get(f"/api/cover/like/{cover.pk}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get(f"/api/cover/like/{last_cover.pk + 1}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        like_count = cover.like_count
        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": True}),
            content_type="application/json",
        )
        cover: Cover = Cover.objects.get(pk=cover.pk)
        self.assertEqual(cover.like_count, like_count + 1)

        response = client.put(
            f"/api/cover/like/{cover.pk}/",
            json.dumps({"isLike": False}),
            content_type="application/json",
        )
        cover: Cover = Cover.objects.get(pk=cover.pk)
        self.assertEqual(cover.like_count, like_count)
