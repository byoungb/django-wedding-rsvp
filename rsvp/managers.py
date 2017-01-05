from django.db.models import QuerySet

from rsvp import HASH


class InviteQuerySet(QuerySet):
    def lookup(self, key):
        return self.get(
            id=HASH.decode(key),
        )
