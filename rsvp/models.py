from django.utils.http import urlencode
from django.urls.base import reverse
from django.db import models

from rsvp.managers import InviteQuerySet
from rsvp.util.qrcode import QRCode
from rsvp import STATUSES, HASH


class Invite(models.Model):
    created = models.DateTimeField(
        auto_now_add=True,
    )
    updated = models.DateTimeField(
        auto_now=True,
    )
    name = models.CharField(
        max_length=128,
    )
    max_guests = models.IntegerField(
        default=2,
    )
    status = models.CharField(
        choices=STATUSES,
        max_length=32,
        null=True,
    )

    objects = InviteQuerySet.as_manager()

    def __unicode__(self):
        return self.name

    @property
    def key(self):
        return HASH.encode(self.pk)

    def check_key(self, key):
        return self.key == key

    def get_absolute_url(self):
        return '{path}?{query}'.format(
            path=reverse(
                viewname='index',
            ),
            query=urlencode({
                'key': self.key,
            }),
        )

    def qr_code(self, request):
        return QRCode(
            url=request.build_absolute_uri(
                location=self.get_absolute_url(),
            ),
        )


class View(models.Model):
    invite = models.ForeignKey(
        related_name='views',
        to='rsvp.Invite',
    )
    created = models.DateTimeField(
        auto_now_add=True,
    )


class Meal(models.Model):
    name = models.CharField(
        max_length=32,
    )
    description = models.TextField(
        null=True,
    )


class Guest(models.Model):
    name = models.CharField(
        max_length=128,
    )
    invite = models.ForeignKey(
        related_name='guests',
        to='rsvp.Invite',
    )
    meal = models.ForeignKey(
        related_name='guests',
        to='rsvp.Meal',
    )
