""" Band views
Comment views for band
TODO:
1. CommentCreate
2. CommentDelete
3. CommentUpdate
4. CommentList

"""
from django.http.request import HttpRequest
from rest_framework import mixins, generics, status
from rest_framework.response import Response
from band.models import (
    CoverComment,
    Cover,
    SongComment,
    Song,
    CombinationComment,
    Combination,
)
from band.serializers import (
    CoverCommentSerializer,
    SongCommentSerializer,
    CombinationCommentSerializer,
)
from dj_rest_auth.jwt_auth import JWTCookieAuthentication

# pylint: disable=W0613
# temporarily disable unused-argument, no-self-use warning


class CoverCommentView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    """cover/`int:cover_id`/comment/"""

    queryset = CoverComment.objects.none()
    serializer_class = CoverCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def list(self, request: HttpRequest, cover_id: int, **kwargs):
        try:

            queryset = CoverComment.objects.filter(
                cover_id=cover_id, parent_comment=None
            )
        except Cover.DoesNotExist:
            return Response("Cover does not exist.", status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.list(
            request,
            *args,
            **kwargs,
        )

    def post(self, request: HttpRequest, **kwargs):
        data = request.data.copy()
        try:
            Cover.objects.get(id=data["cover_id"])
        except Cover.DoesNotExist:
            return Response("Cover does not exist.", status=status.HTTP_400_BAD_REQUEST)

        data["user_id"] = request.user.id

        serializer: CoverCommentSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CoverCommentInfoView(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    """cover/`int:cover_id`/comment/`int:comment_id`/"""

    queryset = CoverComment.objects.none()
    serializer_class = CoverCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs, partial=True)


class SongCommentView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    """song/`int:song_id`/comment/"""

    queryset = SongComment.objects.none
    serializer_class = SongCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def list(self, request: HttpRequest, song_id: int, **kwargs):
        try:

            queryset = SongComment.objects.filter(song_id=song_id, parent_comment=None)
        except Song.DoesNotExist:
            return Response("Song does not exist.", status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.list(
            request,
            *args,
            **kwargs,
        )

    def post(self, request: HttpRequest, **kwargs):
        data = request.data.copy()
        try:
            Song.objects.get(id=data["song_id"])
        except Song.DoesNotExist:
            return Response("Song does not exist.", status=status.HTTP_400_BAD_REQUEST)

        data["user_id"] = request.user.id

        serializer: CoverCommentSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SongCommentInfoView(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    """song/`int:song_id`/comment/`int:comment_id`/"""

    queryset = CoverComment.objects.none()
    serializer_class = CoverCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs, partial=True)


class CombinationCommentView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    """combination/`int:combination_id`/comment/"""

    queryset = CombinationComment.objects.none()
    serializer_class = CombinationCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def list(self, request: HttpRequest, combination_id: int, **kwargs):
        try:

            queryset = CombinationComment.objects.filter(
                combination_id=combination_id, parent_comment=None
            )
        except Combination.DoesNotExist:
            return Response(
                "Combination does not exist.", status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.list(
            request,
            *args,
            **kwargs,
        )

    def post(self, request: HttpRequest, **kwargs):
        data = request.data.copy()
        try:
            Combination.objects.get(id=data["combination_id"])
        except Combination.DoesNotExist:
            return Response(
                "Combination does not exist.", status=status.HTTP_400_BAD_REQUEST
            )

        data["user_id"] = request.user.id

        serializer: CombinationCommentSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CombinationCommentInfoView(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    """combination/`int:combination_id`/comment/`int:comment_id`/"""

    queryset = CombinationComment.objects.none()
    serializer_class = CombinationCommentSerializer
    authentication_classes = (JWTCookieAuthentication,)

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs, partial=True)
