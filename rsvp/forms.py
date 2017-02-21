from django.db.models import Q
from django import forms

from rsvp.models import Invite, Guest


class SearchForm(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            },
        ),
        required=False,
    )

    def suggestions(self):
        return Invite.objects.filter(
            Q(guests__name__icontains=self.cleaned_data['name']) |
            Q(name__icontains=self.cleaned_data['name'])
        ).prefetch_related(
            'guests',
        )


class GuestForm(forms.ModelForm):
    class Meta:
        model = Guest
        fields = [
            'is_attending',
            'name',
        ]


class InviteForm(forms.ModelForm):
    class Meta:
        model = Invite
        fields = []

    def __init__(self, *args, **kwargs):
        super(InviteForm, self).__init__(*args, **kwargs)
        self.guest_forms = []
        guest_data = {guest['id']: guest for guest in self.data.get('guests', [])}
        for guest in self.instance.guests.all():
            self.guest_forms.append(GuestForm(
                data=guest_data.get(guest.id),
                instance=guest,
            ))

    def is_valid(self):
        if super(InviteForm, self).is_valid():
            return all([guest_form.is_valid() for guest_form in self.guest_forms])
        return False

    def save(self, commit=True):
        instance = super(InviteForm, self).save(
            commit=commit,
        )
        for guest_form in self.guest_forms:
            guest_form.save(
                commit=commit,
            )
        instance.is_submitted = True
        instance.save(
            update_fields=[
                'is_submitted',
            ],
        )
        return instance


# class VerifyForm(forms.Form):
#     invite = forms.ModelChoiceField(
#         queryset=Invite.objects.all(),
#         widget=forms.HiddenInput(),
#         required=False,
#     )
#     key = forms.CharField(
#         widget=forms.TextInput(
#             attrs={
#                 'class': 'form-control',
#             },
#         ),
#         required=False,
#     )
#
#     def is_valid(self):
#         return (
#             super(VerifyForm, self).is_valid() and
#             self.cleaned_data.get('invite') and
#             self.check_invite_key()
#         )
#
#     def clean_key(self):
#         if 'key' in self.cleaned_data:
#             return self.cleaned_data['key'].upper()
#
#     def check_invite_key(self):
#         return self.cleaned_data['invite'].check_key(
#             key=self.cleaned_data['key'],
#         )
#
#     def clean(self):
#         data = super(VerifyForm, self).clean()
#         if (
#             data.get('invite') and
#             not data.get('key')
#         ):
#             self.add_error('key', forms.ValidationError(
#                 message='This field is required.',
#                 code='required',
#             ))
#         elif (
#             data.get('key') and
#             not self.check_invite_key()
#         ):
#             self.add_error('key', forms.ValidationError(
#                 message='"%(key)s" is not the correct invitation code for the invite %(invite)s.',
#                 code='invalid',
#                 params={
#                     'invite': data['invite'],
#                     'key': data['key'],
#                 }
#             ))
#         return data
