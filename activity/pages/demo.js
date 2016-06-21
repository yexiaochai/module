define([
    'AbstractView',
    'pages/en.vote',
    'pages/en.widgets',
    'pages/mod.edit',
    'pages/mod.preview',
    'pages/mod.view',
    'text!pages/tpl.layout.html',
    'text!pages/tpl.widget.type.html'
], function (AbstractView,
             VoteEntity,
             WidgetsEntity,
             EditModule,
             PreviewModule,
             ViewModule,
             layoutHtml,
             widgetTypeHtml
) {
    return _.inherit(AbstractView, {

        propertys: function ($super) {
            $super();

            this.viewId = 'demo';
            this.template = layoutHtml;
            this.events = {
                'click .js-widget-type li': 'addWidget',
                'click .js-widget-edit': 'editWidget',
                'click .js-widget-del': 'deleteWidget'
            };

            //页面所有组件
            this.widgetsEntity = new WidgetsEntity();
            this.widgetsEntity.subscribe(this.renderPreview, this);
            //this.widgetsEntity.subscribe(this.renderView, this);

            //所有组件类型,暂时只测试投票类型
            this.widgetType = [{
                id: 'vote',
                name: '添加投票组件'
            }];

        },

        addWidget: function () {
            //暂时不判断添加的什么类型,这里只关注投票类型

            var voteEntity = new VoteEntity();
            //this.voteEntity.subscribe(this.renderPreview, this);
            //this.voteEntity.subscribe(this.renderEidt, this);

            var widgets = new PreviewModule({
                view: this,
                selector: '.js-preview',
                entity: voteEntity
            });

            this.widgetsEntity.pushWidget(widgets);

        },

        editWidget: function (e) {
            var el = $(e.currentTarget);
            var index = el.attr('data-index');

            var widget = this.widgetsEntity.getItem(index);
            var entity = widget.entity;

            console.log(entity)
            console.log(index)

            var mod = new EditModule({
                view: this,
                widgetsEntity: this.widgetsEntity,
                selector: '.js-edit',
                entity: entity
            });

            mod.render();

        },

        deleteWidget: function(e) {

        },

        renderPreview: function () {

            this.$('.js-preview').html('');

            //获取所有的组件
            var widgets = this.widgetsEntity.getWidgets();

            for(var i = 0, len = widgets.length; i < len; i++) {
                widgets[i].setIndex(i);
                widgets[i].render();
            }

        },

        renderView: function () {

        },

        renderEidt: function() {

        },

        initWidgetType: function() {
            var html = _.template(widgetTypeHtml, { data: this.widgetType });
            this.$('.js-widgets').html(html)
        },

        addEvent: function () {
            this.on('onShow', function () {
                this.initWidgetType();

            });
        }

    });

});
