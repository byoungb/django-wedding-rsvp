from django import forms

from rsvp.models import Invite


class SuggestForm(forms.Form):
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            },
        ),
        required=False,
    )

    def suggestions(self):
        invites = []
        if self.cleaned_data['name']:
            invites = Invite.objects.filter(
                name__icontains=self.cleaned_data['name'],
            )
        return [{'id': i.id, 'name': i.name} for i in invites]


class SearchForm(forms.Form):
    invite = forms.ModelChoiceField(
        queryset=Invite.objects.all(),
        widget=forms.HiddenInput(),
        required=False,
    )
    key = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
            },
        ),
        required=False,
    )

    def is_valid(self):
        return (
            super(SearchForm, self).is_valid() and
            self.cleaned_data.get('invite') and
            self.check_invite_key()
        )

    def clean_key(self):
        if 'key' in self.cleaned_data:
            return self.cleaned_data['key'].upper()

    def check_invite_key(self):
        return self.cleaned_data['invite'].check_key(
            key=self.cleaned_data['key'],
        )

    def clean(self):
        data = super(SearchForm, self).clean()
        if (
            data.get('invite') and
            not data.get('key')
        ):
            self.add_error('key', forms.ValidationError(
                message='This field is required.',
                code='required',
            ))
        elif (
            data.get('key') and
            not self.check_invite_key()
        ):
            self.add_error('key', forms.ValidationError(
                message='"%(key)s" is not the correct invitation code for the invite %(invite)s.',
                code='invalid',
                params={
                    'invite': data['invite'],
                    'key': data['key'],
                }
            ))
        return data
