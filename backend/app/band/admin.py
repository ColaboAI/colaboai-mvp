from django.contrib import admin
from .models import (
    Instrument,
    Song,
    Cover,
    Combination,
    CoverTag,
    Category,
    CoverComment,
    SongComment,
    CombinationComment,
)

# Register your models here.
admin.site.register(
    [
        Category,
        Instrument,
        Song,
        Cover,
        Combination,
        CoverTag,
        CoverComment,
        SongComment,
        CombinationComment,
    ]
)
