# Generated by Django 3.2.6 on 2022-11-14 12:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_auto_20221114_1159'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userfollowing',
            old_name='following_user_id',
            new_name='following_user',
        ),
        migrations.RenameField(
            model_name='userfollowing',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterUniqueTogether(
            name='userfollowing',
            unique_together={('user', 'following_user')},
        ),
    ]
