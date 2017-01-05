from json import loads

from django.forms.models import model_to_dict
from django.views.generic.base import TemplateResponseMixin, View

from rsvp.util.encoders import InviteEncoder as BaseInviteEncoder
from rsvp.util.mixins.json import JsonResponseMixin
from rsvp.admin.forms import InviteForm
from rsvp.models import Invite


class InviteEncoder(BaseInviteEncoder):
    def default(self, o):
        if isinstance(o, Invite):
            data = model_to_dict(
                instance=o,
                fields=[
                    'id',
                    'name',
                ],
            )
            data['url'] = o.get_absolute_url()
            return data
        return super(InviteEncoder, self).default(o)


class IndexView(TemplateResponseMixin, View):
    template_name = 'admin/index.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({
        })


class InviteView(TemplateResponseMixin, JsonResponseMixin, View):
    template_name = 'admin/invites.html'
    encoder = InviteEncoder

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            invites = Invite.objects.all()
            return self.json_to_response(invites)
        return self.render_to_response({})

    def post(self, request, *args, **kwargs):
        form = InviteForm(
            data=loads(request.body),
        )
        if not form.is_valid():
            raise Exception(form.errors)
        invite = form.save()
        return self.json_to_response(invite)
