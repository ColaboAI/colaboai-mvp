# Generated by Django 3.2.6 on 2022-11-03 07:04

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('band', '0012_auto_20221103_0603'),
    ]

    operations = [
        migrations.RenameField(
            model_name='combinationcomment',
            old_name='timestamp',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='covercomment',
            old_name='timestamp',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='songcomment',
            old_name='timestamp',
            new_name='created_at',
        ),
        migrations.AddField(
            model_name='combination',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='combinationcomment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='cover',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cover',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='covercomment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='song',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='song',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='songcomment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]