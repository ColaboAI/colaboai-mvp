""" Band views
Comment views for band
TODO:
1. CommentCreate
2. CommentDelete
3. CommentUpdate
4. CommentList

"""
from django.http.request import HttpRequest
from rest_framework import mixins, generics, filters, status
from rest_framework.response import Response
from band.models import CoverComment, Cover
from band.serializers import CoverCommentSerializer

# pylint: disable=W0613
# temporarily disable unused-argument, no-self-use warning


class CoverCommentView(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
):
    """cover/`int:cover_id`/comment/"""

    queryset = CoverComment.objects.all()
    serializer_class = CoverCommentSerializer

    def get(self, request: HttpRequest, **kwargs):
        return self.list(request)

    def post(self, request: HttpRequest, **kwargs):
        data = request.data.copy()
        try:
            Cover.objects.get(id=data["cover_id"])
        except Cover.DoesNotExist:
            return Response("Cover does not exist.", status=status.HTTP_400_BAD_REQUEST)

        data["user_id"] = request.user.id
        data["parent_comment_id"] = request.data.get("parent_comment_id", None)

        serializer: CoverCommentSerializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CoverCommentInfoView(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    """cover/`int:cover_id`/comment/`int:comment_id`/"""

    queryset = CoverComment.objects.all()
    serializer_class = CoverCommentSerializer

    def get(self, request: HttpRequest, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request: HttpRequest, *args, **kwargs):
        return self.update(request, *args, **kwargs, partial=True)
