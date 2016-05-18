define(['ModuleView', 'text!pages/tpl.sort.bar.html'], function (ModuleView, tpl) {
    return _.inherit(ModuleView, {

        //此处若是要使用model，处实例化时候一定要保证entity的存在，如果不存在便是业务BUG
        initData: function () {

            this.template = tpl;
            this.events = {
                'click .js_sort_item li ': function (e) {
                    var el = $(e.currentTarget);
                    var sort = el.attr('data-sort');
                    this.sortEntity['set' + sort]();
                }
            };

            this.sortEntity.subscribe(this.render, this);

        },

        _timeSort: function (data, sort) {
            data = _.sortBy(data, function (item) {
                item = item.from_time.split(':');
                item = item[0] + '.' + item[1];
                item = parseFloat(item);
                return item;
            });
            if (sort == 'down') data.reverse();
            return data;
        },

        _sumTimeSort: function (data, sort) {
            data = _.sortBy(data, function (item) {
                return parseInt(item.use_time);
            });
            if (sort == 'down') data.reverse();
            return data;
        },

        _priceSort: function (data, sort) {
            data = _.sortBy(data, function (item) {
                return item.min_price;
            });
            if (sort == 'down') data.reverse();
            return data;
        },

        //获取导航栏排序后的数据
        getSortData: function (data) {
            var tmp = [];
            var sort = this.sortEntity.get();

            for (var k in sort) {
                if (sort[k].length > 0) {
                    tmp = this['_' + k + 'Sort'](data, sort[k])
                    return tmp;
                }
            }
        },

        getViewModel: function () {
            return this.sortEntity.get();
        }

    });

});
