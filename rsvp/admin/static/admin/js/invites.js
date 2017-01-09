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

    var GuestModel = Backbone.Model.extend({});

    var GuestCollection = Backbone.Collection.extend({
        model: GuestModel
    });

    var InviteModel = Backbone.Model.extend({
        parse: function (response) {
            response.guests = new GuestCollection(response.guests);
            return response;
        },
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
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
        initialize: function () {
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
            this.$('#guest_' + guest_id).remove();
        },
        submit: function (event) {
            event.preventDefault();
            var data = this.$el.serializeObject();
            _.each(data, function (value, key) {
                if (key.match('^id_')) {
                    var guest_data = {
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
            this.model.set({
                name: data.name
            });
            this.model.save();
            this.$el.modal('hide');
            this.model.collection.add(this.model);
        }
    });

    var InvitesView = Backbone.View.extend({
        events: {
            'click span.invite-edit': 'edit',
            'click span.invite-add': 'add'
        },
        template: env.getTemplate('invites/row.html'),
        initialize: function () {
            this.listenTo(this.collection, 'sync', this.render);
            this.collection.fetch();
        },
        render: function () {
            this.$('table tbody').empty();
            var fragment = document.createDocumentFragment();
            this.collection.each(function (model) {
                var html = this.template.render({
                    invite: model
                });
                fragment.appendChild($(html).get(0));
            }, this);
            this.$('table tbody').html(fragment);
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
