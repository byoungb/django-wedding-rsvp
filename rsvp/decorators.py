from functools import wraps

from django.utils.decorators import available_attrs


def record_views(view_func):
    @wraps(view_func, assigned=available_attrs(view_func))
    def inner(request, *args, **kwargs):
        # if request.invite:
        #     request.invite.views.create()
        return view_func(request, *args, **kwargs)
    return inner
