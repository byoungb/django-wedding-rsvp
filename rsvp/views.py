from django.views.generic.base import TemplateResponseMixin, View
from django.utils.decorators import method_decorator
from django.http.request import QueryDict

from rsvp.models import Site
from rsvp.util.mixins.json import JsonResponseMixin
from rsvp.forms import SuggestForm, SearchForm
from rsvp.decorators import record_views
from rsvp.encoders import InviteEncoder
from rsvp import login


class IndexView(TemplateResponseMixin, View):
    template_name = 'index.html'

    @method_decorator(record_views)
    def get(self, request, *args, **kwargs):
        site = Site.objects.get(
            domain=request.get_host(),
        )
        return self.render_to_response({
            'GOOGLE_MAPS_API_KEY': 'AIzaSyCYhdc-qA-ut3oH4YNfVFKHHgnvIo6eM0U',
            'suggest_form': SuggestForm(
                auto_id=None,
            ),
            'search_form': SearchForm(
                auto_id=None,
            ),
            'site': site,
        })


class SearchView(JsonResponseMixin, View):
    encoder = InviteEncoder

    def put(self, request, *args, **kwargs):
        form = SuggestForm(
            data=QueryDict(request.body),
        )
        if not form.is_valid():
            return self.json_to_response(
                context=form.errors,
                status=400,
            )
        return self.json_to_response(
            context=form.suggestions(),
        )

    def post(self, request, *args, **kwargs):
        form = SearchForm(
            data=request.POST,
        )
        if not form.is_valid():
            return self.json_to_response(
                context=form.errors,
                status=400,
            )
        login(request, form.cleaned_data.get('invite'))
        return self.json_to_response()
