# Generated by Django 3.2.7 on 2021-11-26 15:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('band', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='combination',
            name='likes',
            field=models.ManyToManyField(blank=True, db_table='Combination_Likes', related_name='like_combinations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='cover',
            name='audio',
            field=models.FileField(editable=False, upload_to='cover_audio'),
        ),
        migrations.AlterField(
            model_name='cover',
            name='category',
            field=models.CharField(db_column='category', editable=False, max_length=30),
        ),
        migrations.AlterField(
            model_name='cover',
            name='combination',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='band.combination'),
        ),
        migrations.AlterField(
            model_name='cover',
            name='likes',
            field=models.ManyToManyField(blank=True, db_table='Cover_Likes', related_name='like_covers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='cover',
            name='tags',
            field=models.ManyToManyField(blank=True, db_table='Cover_Tags', to='band.CoverTag'),
        ),
    ]
