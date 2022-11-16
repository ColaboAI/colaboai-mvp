""" Band views
category views for band
TODO ("implement")
"""
from rest_framework import viewsets
from band.serializers import CategorySerializer
from band.models import Category


class CategoryViews(viewsets.ModelViewSet):
    """Viewset for category"""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
