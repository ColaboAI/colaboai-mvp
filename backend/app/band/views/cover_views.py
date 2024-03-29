""" Band views
cover views for band
"""
import json
from json.decoder import JSONDecodeError
from django.core.files.uploadedfile import UploadedFile
from django.http.request import HttpRequest
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import mixins, generics, status
from dj_rest_auth.jwt_auth import JWTCookieAuthentication
from bandcruit.settings import FILE_UPLOAD_MAX_MEMORY_SIZE
from band.models import Cover, Song
from band.serializers import CoverSerializer, CoverLikeSerializer


class CoverSong(mixins.ListModelMixin, generics.GenericAPIView):
    """cover/<int:song_id>/"""

    queryset = Cover.objects.none()
    serializer_class = CoverSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def get(self, request: HttpRequest, song_id: int):
        self.queryset = Cover.objects.filter(song__id=song_id)
        return self.list(request)

    def post(self, request: Request, song_id: int):
        try:
            Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return Response("Song does not exist.", status=status.HTTP_400_BAD_REQUEST)

        # check audio file
        audio: UploadedFile = request.data.get("audio")

        if not isinstance(audio, UploadedFile):
            return Response("No audio file.", status=status.HTTP_400_BAD_REQUEST)

        if len(audio) > FILE_UPLOAD_MAX_MEMORY_SIZE:
            return Response(
                "File size larger than 15MB.", status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data["user_id"] = request.user.id
        data["song_id"] = song_id
        try:
            instrument_id = data.pop("instrument")
            data["instrument_id"] = int(instrument_id[0])
        except (KeyError, ValueError):
            return Response(
                "'instrument' should be a number.",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # check tags
        if data.get("tags") is not None:
            tags = data.pop("tags")
            try:
                tags_list = json.loads(tags[0])
            except JSONDecodeError:
                return Response(
                    "'tags' is not in json format.",
                    status=status.HTTP_400_BAD_REQUEST,
                )
            data["tags_list"] = tags_list
        serializer: CoverSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CoverSongInstrument(mixins.ListModelMixin, generics.GenericAPIView):
    """cover/<int:song_id>/<int:instrument_id>/"""

    queryset = Cover.objects.none()
    serializer_class = CoverSerializer

    def get(self, request: HttpRequest, song_id: int, instrument_id: int):
        self.queryset = Cover.objects.filter(
            song__id=song_id, instrument__id=instrument_id
        )
        return self.list(request)


class CoverInfo(mixins.RetrieveModelMixin, generics.GenericAPIView):
    """cover/info/<int:pk>/"""

    queryset = Cover.objects.all()
    serializer_class = CoverSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def update(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # check instrument
        if data.get("instrument") is not None:
            instrument_id = data.pop("instrument")
            data["instrument_id"] = int(instrument_id)

        # check tags
        if data.get("tags") is not None:
            data["tags_list"] = data.pop("tags")
        serializer: CoverSerializer = self.get_serializer(
            instance, data=data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request: HttpRequest, *args, **kwargs):
        instance: Cover = self.get_object()
        instance.delete()
        return Response()


class CoverLike(generics.GenericAPIView):
    """cover/like/<int:pk>/"""

    queryset = Cover.objects.all()
    serializer_class = CoverLikeSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        instance: Cover = self.get_object()
        serializer: CoverLikeSerializer = self.get_serializer(instance)

        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        res_data = {"isLiked": request.user.id in serializer.data.get("likes")}
        return Response(res_data, content_type="application/json")

    def put(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer_old: CoverLikeSerializer = self.get_serializer(instance)
        likes: list = serializer_old.data.get("likes")

        is_like = request.data.get("is_liked")
        if is_like is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        if is_like:
            if user_id not in likes:
                # like the cover
                likes.append(user_id)
                serializer: CoverLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()
        else:
            if user_id in likes:
                # unlike the cover
                likes.remove(user_id)
                serializer: CoverLikeSerializer = self.get_serializer(
                    instance, data={"likes": likes}, partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        res_data = {"isLiked": is_like}
        return Response(res_data, content_type="application/json")
