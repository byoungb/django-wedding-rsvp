from django.views.generic.base import TemplateResponseMixin, View


class IndexView(TemplateResponseMixin, View):
    template_name = 'admin/index.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({
        })


class GuestsView(TemplateResponseMixin, View):
    template_name = 'admin/guests.html'

    def get(self, request, *args, **kwargs):
        return self.render_to_response({
        })
