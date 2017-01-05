from __future__ import absolute_import

from json import dumps

from django.http import HttpResponse


class JsonResponseMixin(object):
    encoder = None

    def json_to_response(self, context=None, encoder=None, **response_kwargs):
        return HttpResponse(
            content=self.convert_context_to_json(
                context=context if context is not None else {},
                encoder=encoder,
            ),
            content_type='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context, encoder=None):
        cls = encoder or self.encoder
        return dumps(
            obj=context,
            cls=cls,
        )
