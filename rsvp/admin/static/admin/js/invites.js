(function (globals, $) {

    var env = nunjucks.configure('/static/admin/templates', {
        autoescape: false
    });

    var guest_form = env.getTemplate('invites/guest.html');

    env.addFilter('guest_form', function (guest) {
        return guest_form.render({
            guest: guest
        });
    });

    var GuestModel = Backbone.Model.extend({
        defaults: {
            is_attending: false
        }
    });

    var GuestCollection = Backbone.Collection.extend({
        model: GuestModel,
        attending: function () {
            return new GuestCollection(this.filter({
                is_attending: true
            }));
        },
        break_down: function () {
            var output = {
                not_attending_children: 0,
                not_attending_adults: 0,
                attending_children: 0,
                attending_adults: 0
            };
            this.each(function (model) {
                if (model.get('type') == 'adult') {
                    if (!model.get('is_attending')) {
                        output.not_attending_adults += 1;
                    } else {
                        output.attending_adults += 1;
                    }
                } else if (model.get('type') == 'child') {
                    if (!model.get('is_attending')) {
                        output.not_attending_children += 1;
                    } else {
                        output.attending_children += 1;
                    }
                }
            });
            return output;
        },
        toString: function () {
            var data = this.break_down();
            return (
                'Adults: ' + data.attending_adults + ' ' +
                'Children: ' + data.attending_children
            );
        }
    });

    var InviteModel = Backbone.Model.extend({
        defaults: function () {
            return {
                guests: new GuestCollection(),
                is_submitted: false
            };
        },
        parse: function (response) {
            response.guests = new GuestCollection(response.guests);
            return response;
        }
    });

    var InviteCollection = Backbone.Collection.extend({
        model: InviteModel,
        url: location.href
    });

    var InviteFormView = Backbone.View.extend({
        tagName: 'form',
        className: 'modal fade',
        attributes: {
            'onkeypress': 'return event.keyCode != 13;',
            'autocomplete': 'off'
        },
        events: {
            'click button.remove-guest': 'remove_guest',
            'click button.add-guest': 'add_guest',
            'hidden.bs.modal': 'remove',
            'submit': 'submit'
        },
        template: env.getTemplate('invites/form.html'),
        initialize: function (options) {
            var html = this.template.render({
                invite: this.model
            });
            this.$el.html(html);
        },
        add_guest: function (event) {
            var html = nunjucks.renderString('{{ guest|guest_form }}', {
                guest: new GuestModel()
            });
            this.$('ul.guests-list').append(html);
            this.$('ul.guests-list li:last-child input').focus();
        },
        remove_guest: function (event) {
            var guest_id = this.$(event.currentTarget).data('id');
            this.model.get('guests').remove(guest_id);
            this.$('#guest_' + guest_id).remove();
        },
        submit: function (event) {
            event.preventDefault();
            var data = this.$el.serializeObject();
            _.each(data, function (value, key) {
                if (key.match('^id_')) {
                    var guest_data = {
                        is_attending: (data['is_attending_' + value] == 'on'),
                        name: data['name_' + value],
                        type: data['type_' + value]
                    };
                    if (value.match('^c')) {
                        var guest = new GuestModel(guest_data);
                        this.model.get('guests').add(guest);
                    } else {
                        this.model.get('guests').get(value).set(guest_data);
                    }
                }
            }, this);
            this.model.save('name', data.name);
            this.model.collection.add(this.model);
            this.$el.modal('hide');
        }
    });

    var InvitesView = Backbone.View.extend({
        events: {
            'click span.invite-remove': 'remove',
            'click span.invite-edit': 'edit',
            'click span.invite-add': 'add'
        },
        template: env.getTemplate('invites/row.html'),
        initialize: function () {
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch();
        },
        render: function () {
            var totals = {
                not_attending_children: 0,
                not_attending_adults: 0,
                attending_children: 0,
                attending_adults: 0
            };
            var submitted = this.collection.filter({
                is_submitted: true
            });
            var completed = (submitted.length / this.collection.length);
            var text = (submitted.length + ' of ' + this.collection.length);
            this.$('.progress-bar').css({
                'width': (completed * 100) + '%'
            }).html(text);
            this.$('table tbody').empty();
            var fragment = document.createDocumentFragment();
            this.collection.each(function (model) {
                var data = model.get('guests').break_down();
                var html = this.template.render({
                    invite: model
                });
                fragment.appendChild($(html).get(0));
                totals.not_attending_children += data.not_attending_children;
                totals.not_attending_adults += data.not_attending_adults;
                totals.attending_children += data.attending_children;
                totals.attending_adults += data.attending_adults;
            }, this);
            this.$('table tbody').html(fragment);
            var adults = totals.not_attending_adults + ' of ' + (totals.attending_adults + totals.not_attending_adults);
            this.$('[data-stats="adults"]').text(adults);
            var children = totals.not_attending_children + ' of ' + (totals.attending_children + totals.not_attending_children);
            this.$('[data-stats="children"]').text(children);
        },
        remove: function (event) {
            var invite_id = this.$(event.currentTarget).data('id'),
                model = this.collection.get(invite_id);
            if (confirm('Are you sure?')) {
                this.$('tr[data-invite_id="' + invite_id + '"]').remove();
                model.destroy();
            }
        },
        edit: function (event) {
            var invite_id = this.$(event.currentTarget).data('id'),
                model = this.collection.get(invite_id);
            this.load(model);
        },
        add: function () {
            var model = new InviteModel(null, {
                collection: this.collection
            });
            this.load(model);
        },
        load: function (model) {
            var modal = new InviteFormView({
                model: model
            });
            this.$el.append(modal.el);
            modal.$el.modal();
        }
    });

    $.fn.invites = function (options) {
        return this.each(function () {
            if (!$.data(this, 'invites')) {
                $.data(this, 'invites', new InvitesView(_.extend({
                    collection: new InviteCollection(),
                    el: $(this)
                }, options)));
            }
        });
    };

}(this, jQuery));
