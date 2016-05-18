define([
    'AbstractView'
], function (
    AbstractView
) {

    //实现一个方法产生最大的zindex
    var getBiggerzIndex = (function () {
        var index = 2000;
        return function (level) {
            return level + (++index);
        };
    })();

    return _.inherit(AbstractView, {

        createRoot: function (html) {

            //如果存在style节点，并且style节点不存在的时候需要处理
            if (this.style && !$('#page_' + this.viewId)[0]) {
                $('head').append($('<style id="page_' + this.viewId + '" class="page-style">' + this.style + '</style>'))
            }

            //如果具有fake节点，需要移除
            $('#fake-page').remove();

            //UI的根节点
            this.$el = $('<div class="cm-view page-' + this.viewId + ' ' + this.classname + '" style="display: none; " id="' + this.id + '">' + html + '</div>');
            this.wrapper.append(this.$el);
        },

        propertys: function ($super) {
            $super();

            //这里设置UI的根节点所处包裹层
            this.wrapper = $('body');
            this.viewId = _.uniqueId('ui-view-');

        },

        //为当前View设置最大的zindex,这里用于弹出层情况
        setzIndexTop: function (el, level) {
            if (!el) el = this.$el;
            if (!level || level > 10) level = 0;
            level = level * 1000;
            el.css('z-index', getBiggerzIndex(level));

        },

        _getDefaultViewModel: function (arr) {
            var k, i, len, obj = {};
            for (i = 0, len = arr.length; i < len; i++) {
                k = arr[i];
                if (!_.isUndefined(this[k]) && !_.isNull(this[k])) obj[k] = this[k];
            }
            return obj;
        }

    });

});
