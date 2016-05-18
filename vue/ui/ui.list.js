define([
    'ui/ui.view',
    'ui/ui.mask',
    'text!ui/ui.list.html'

], function (
    UIView,
    UIMask,
    template

) {
    return _.inherit(UIView, {

        propertys: function ($super) {
            $super();

            this.mask = new UIMask();

            this.viewId = 'uilist';

            this.template = template;
            this.classname = 'cm-layer-list';
            this.list = [];
            this.cancelText = '取消';
            this.index = -1;
            this.displayNum = 5;
            this.curClass = 'active';


            this.addEvents({
                'click .js_cancel': 'cancelAction',
                'click .js_item': 'itemAction'
            });

            this.onItemAction = function (data, index, e) {
            };

        },

        getViewModel: function () {
            return this._getDefaultViewModel(['list', 'cancelText', 'index', 'curClass', 'itemFn', 'title']);
        },

        setIndex: function (i, position) {
            if (i < 0 || i > this.list.length) return;
            this.index = i;
            this.$('li').removeClass(this.curClass);
            this.$('li[data-index="' + i + '"]').addClass(this.curClass);

        },

        cancelAction: function (e) {
            this.hide();
        },

        //弹出层类垂直居中使用
        reposition: function () {
            this.$el.css({
                'position': 'fixed',
                '-webkit-box-sizing': 'border-box',
                'box-sizing': 'border-box',
                'width': '100%',
                'left': '0',
                'background-color': '#fff',
                'bottom': '36px'
            });
        },

        itemAction: function (e) {
            var el = $(e.currentTarget);
            if (el.hasClass('disabled')) return;

            var index = el.attr('data-index');
            var data = this.list[index];
            this.setIndex(index);
            this.onItemAction.call(this, data, index, e);

        },

        addEvent: function () {

            this.on('onPreShow', function () {
                this.mask.show();
            });

            this.on('onShow', function () {

                this.setzIndexTop();
                this.reposition();

            });

            this.on('onHide', function () {
                this.mask.hide();
            });

        }

    });

});
