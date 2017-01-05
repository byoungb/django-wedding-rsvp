from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db.models.query import QuerySet

from rsvp.models import Invite


class InviteEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, QuerySet):
            return list(o)
        if isinstance(o, Invite):
            return model_to_dict(
                instance=o,
                fields=[
                    'id',
                    'name',
                ],
            )
        return super(InviteEncoder, self).default(o)
