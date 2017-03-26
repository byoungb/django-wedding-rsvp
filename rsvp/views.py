from hashlib import md5
from json import loads

from django.views.generic.base import TemplateResponseMixin, View
from django.utils.decorators import method_decorator
from django.http.response import Http404

from rsvp.util.mixins.json import JsonResponseMixin
from rsvp.forms import SearchForm, InviteForm
from rsvp.decorators import record_views
from rsvp.encoders import InviteEncoder
from rsvp.models import Site, Invite


class IndexView(TemplateResponseMixin, View):
    template_name = 'index.html'

    @method_decorator(record_views)
    def get(self, request, *args, **kwargs):
        return self.render_to_response({
            'GOOGLE_MAPS_API_KEY': 'AIzaSyCYhdc-qA-ut3oH4YNfVFKHHgnvIo6eM0U',
            'stamp': md5(b'4').hexdigest(),
            'search_form': SearchForm(
                auto_id=None,
            ),
            'site': Site.objects.get(
                domain=request.get_host(),
            ),
        })


class ApiView(JsonResponseMixin, View):
    encoder = InviteEncoder

    def get(self, request, *args, **kwargs):
        form = SearchForm(
            data=request.GET,
        )
        if not form.is_valid():
            return self.json_to_response(
                context=form.errors,
                status=400,
            )
        return self.json_to_response(
            context=form.suggestions(),
        )

    def put(self, request, invite_id, *args, **kwargs):
        try:
            invite = Invite.objects.get(
                id=invite_id,
            )
        except Invite.DoesNotExist:
            raise Http404()
        form = InviteForm(
            data=loads(request.body.decode('utf-8')),
            instance=invite,
        )
        if not form.is_valid():
            return self.json_to_response(
                context=form.errors,
                status=400,
            )
        instance = form.save()
        return self.json_to_response(
            context=instance,
        )
