# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-10 03:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rsvp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='invite',
            name='max_guests',
            field=models.IntegerField(default=2),
        ),
    ]