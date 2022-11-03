# Generated by Django 3.2.6 on 2022-11-03 06:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('band', '0011_auto_20221103_0600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='combinationcomment',
            name='parent_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reply', to='band.combinationcomment'),
        ),
        migrations.AlterField(
            model_name='covercomment',
            name='parent_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reply', to='band.covercomment'),
        ),
        migrations.AlterField(
            model_name='songcomment',
            name='parent_comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reply', to='band.songcomment'),
        ),
    ]