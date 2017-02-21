from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db.models.query import QuerySet
from django.db.models import Model

from rsvp.models import Invite, Guest, Story, Icon
from rsvp.managers import InviteQuerySet


class ModelEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return list(o)
        if isinstance(o, Model):
            return model_to_dict(o)
        return super(ModelEncoder, self).default(o)


class StoryEncoder(ModelEncoder):
    def default(self, o):
        if isinstance(o, Story):
            data = model_to_dict(
                instance=o,
                exclude=[
                    'icon',
                ],
            )
            try:
                data.update({
                    'icon': model_to_dict(o.icon),
                })
            except Icon.DoesNotExist:
                pass
            return data
        return super(StoryEncoder, self).default(o)


class InviteEncoder(ModelEncoder):
    def default(self, o):
        if isinstance(o, InviteQuerySet):
            return list(o.prefetch_related('guests'))
        if isinstance(o, Guest):
            return model_to_dict(
                instance=o,
                fields=[
                    'type',
                    'name',
                    'id',
                ],
            )
        if isinstance(o, Invite):
            data = model_to_dict(
                instance=o,
                fields=[
                    'id',
                    'name',
                ],
            )
            data.update({
                'guests': o.guests.all(),
            })
            return data
        return super(InviteEncoder, self).default(o)
