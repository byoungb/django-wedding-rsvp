(function (globals, $) {

    var env = nunjucks.configure('/static/admin/templates', {
        autoescape: false
    });

    var StoryModel = Backbone.Model.extend({
        parse: function (response, options) {
            response.icon = new Backbone.Model(response.icon);
            return response;
        },
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
        }
    });

    var StoryCollection = Backbone.Collection.extend({
        model: StoryModel,
        url: location.href
    });

    var StoryFormView = Backbone.View.extend({
        tagName: 'form',
        className: 'modal fade',
        attributes: {
            'onkeypress input': 'return event.keyCode != 13;',
            'autocomplete': 'off'
        },
        events: {
            'click ul.icon-list li.btn': 'select_icon',
            'hidden.bs.modal': 'remove',
            'submit': 'submit'
        },
        template: env.getTemplate('stories/form.html'),
        initialize: function () {
            var html = this.template.render({
                icons: this.collection,
                story: this.model
            });
            this.$el.html(html);
        },
        select_icon: function (event) {
            this.$('li.btn.btn-primary').removeClass('btn-primary').addClass('btn-default');
            var icon_id = parseInt(this.$(event.currentTarget).data('id'));
            this.$('input[name="icon"]').val(icon_id);
            console.log(icon_id)
        },
        submit: function (event) {
            event.preventDefault();
            var data = this.$el.serializeObject();
            this.model.save(data);
            this.$el.modal('hide');
            this.model.collection.add(this.model);
        }
    });

    var StoriesView = Backbone.View.extend({
        events: {
            'click span.story-edit': 'edit',
            'click span.story-add': 'add'
        },
        template: env.getTemplate('stories/row.html'),
        initialize: function (options) {
            this.listenTo(this.collection, 'sync', this.render);
            this.icons = new Backbone.Collection(options.icons);
            this.collection.fetch();
        },
        render: function () {
            this.$('table tbody').empty();
            var fragment = document.createDocumentFragment();
            this.collection.each(function (model) {
                var html = this.template.render({
                    story: model
                });
                fragment.appendChild($(html).get(0));
            }, this);
            this.$('table tbody').html(fragment);
        },
        edit: function (event) {
            var story_id = this.$(event.currentTarget).data('id'),
                model = this.collection.get(story_id);
            this.load(model);
        },
        add: function () {
            var model = new StoryModel(null, {
                collection: this.collection
            });
            this.load(model);
        },
        load: function (model) {
            var modal = new StoryFormView({
                collection: this.icons,
                model: model
            });
            this.$el.append(modal.el);
            modal.$el.modal();
        }
    });

    $.fn.stories = function (options) {
        return this.each(function () {
            if (!$.data(this, 'stories')) {
                $.data(this, 'stories', new StoriesView(_.extend({
                    collection: new StoryCollection(),
                    el: $(this)
                }, options)));
            }
        });
    };

}(this, jQuery));
