# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-02-19 21:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rsvp', '0006_auto_20170121_1048'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invite',
            name='max_guests',
        ),
        migrations.RemoveField(
            model_name='invite',
            name='status',
        ),
        migrations.AddField(
            model_name='guest',
            name='is_attending',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='invite',
            name='is_submitted',
            field=models.BooleanField(default=False),
        ),
    ]
