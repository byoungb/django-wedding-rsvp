from json import loads, dumps

from django.views.generic.base import TemplateResponseMixin, View

from rsvp.admin.encoders import ModelEncoder, InviteEncoder, StoryEncoder
from rsvp.util.mixins.json import JsonResponseMixin
from rsvp.admin.forms import InviteForm, StoryForm
from rsvp.models import Invite, Story, Site, Icon


class IndexView(TemplateResponseMixin, View):
    template_name = 'admin/index.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({
        })


class StoryView(TemplateResponseMixin, JsonResponseMixin, View):
    template_name = 'admin/stories.html'
    encoder = StoryEncoder

    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            invites = Story.objects.all()
            return self.json_to_response(invites)
        icons = Icon.objects.all()
        return self.render_to_response({
            'icons': dumps(icons, cls=ModelEncoder),
        })

    def post(self, request, *args, **kwargs):
        site = Site.objects.get(
            domain=request.get_host(),
        )
        form = StoryForm(
            data=loads(request.body),
            instance=Story(
                site=site
            ),
        )
        if not form.is_valid():
            raise Exception(form.errors)
        story = form.save()
        return self.json_to_response(story)

    def put(self, request, story_id, *args, **kwargs):
        instance = Story.objects.get(
            id=story_id,
        )
        form = StoryForm(
            data=loads(request.body),
            instance=instance,
        )
        if not form.is_valid():
            raise Exception(form.errors)
        story = form.save()
        return self.json_to_response(story)


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

    def put(self, request, invite_id, *args, **kwargs):
        instance = Invite.objects.get(
            id=invite_id,
        )
        form = InviteForm(
            data=loads(request.body),
            instance=instance,
        )
        if not form.is_valid():
            raise Exception(form.errors)
        invite = form.save()
        return self.json_to_response(invite)
