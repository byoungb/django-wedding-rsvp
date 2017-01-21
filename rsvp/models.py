from __future__ import unicode_literals

from django.core.exceptions import ObjectDoesNotExist
from django.utils.http import urlencode
from django.urls.base import reverse
from django.db import models

from rsvp import STATUSES, HASH, GUEST_TYPES, EVENT_TYPES
from rsvp.managers import InviteQuerySet
from rsvp.util.qrcode import QRCode


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

    def qr_code(self):
        # TODO: Use domain from site
        return QRCode(
            url='https://local.rsvp.com{}'.format(self.get_absolute_url()),
        )


class View(models.Model):
    invite = models.ForeignKey(
        related_name='views',
        to='rsvp.Invite',
    )
    created = models.DateTimeField(
        auto_now_add=True,
    )


class Guest(models.Model):
    name = models.CharField(
        max_length=128,
        blank=True,
    )
    invite = models.ForeignKey(
        related_name='guests',
        to='rsvp.Invite',
    )
    type = models.CharField(
        default=GUEST_TYPES.ADULT,
        choices=GUEST_TYPES,
        max_length=16,
    )


class Address(models.Model):
    name = models.CharField(
        max_length=128,
    )
    street = models.CharField(
        max_length=128,
    )
    city = models.CharField(
        max_length=128,
    )
    state = models.CharField(
        max_length=128,
    )
    zip = models.IntegerField()
    lat = models.FloatField()
    lon = models.FloatField()


class Event(models.Model):
    site = models.ForeignKey(
        related_name='events',
        to='rsvp.Site',
    )
    address = models.ForeignKey(
        related_name='+',
        to='rsvp.Address',
    )
    event_type = models.CharField(
        choices=EVENT_TYPES,
        max_length=128,
    )
    datetime = models.DateTimeField()
    duration = models.DurationField(
        null=True,
    )


class Site(models.Model):
    bride_name = models.CharField(
        max_length=128,
    )
    groom_name = models.CharField(
        max_length=128,
    )
    domain = models.CharField(
        max_length=128,
    )

    @property
    def ceremony(self):
        try:
            return self.events.get(
                event_type=EVENT_TYPES.CEREMONY,
            )
        except ObjectDoesNotExist:
            return None

    @property
    def reception(self):
        try:
            return self.events.get(
                event_type=EVENT_TYPES.RECEPTION,
            )
        except ObjectDoesNotExist:
            return None


class Story(models.Model):
    site = models.ForeignKey(
        related_name='stories',
        to='rsvp.Site',
    )
    icon = models.ForeignKey(
        related_name='stories',
        to='rsvp.Icon',
    )
    title = models.CharField(
        max_length=128,
    )
    body = models.TextField()


class Icon(models.Model):
    font_family = models.CharField(
        max_length=32,
    )
    font_class = models.CharField(
        max_length=32,
    )
