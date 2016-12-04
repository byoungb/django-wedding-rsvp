from django.db import models

from rsvp import STATUSES


class Guest(models.Model):
    name = models.CharField(
        max_length=128,
    )
    created = models.DateTimeField(
        auto_now_add=True,
    )
    updated = models.DateTimeField(
        auto_now=True,
    )
    status = models.CharField(
        choices=STATUSES,
        max_length=32,
        null=True,
    )

# class History(models.Model):
#     pass
