define(['ModuleView', 'text!pages/tpl.sort.bar.html'], function (ModuleView, tpl) {
    return _.inherit(ModuleView, {

//记录需要根View注入的属性
        props: ['entity', 'myname'],

        //此处若是要使用model，处实例化时候一定要保证entity的存在，如果不存在便是业务BUG
        initData: function () {

            this.template = tpl;
            this.events = {
                'click .js_sort_item li ': function (e) {
                    var el = $(e.currentTarget);
                    var sort = el.attr('data-sort');
                    this.entity['set' + sort]();
                }
            };

            this.entity.subscribe(this.render, this);

        },

        getViewModel: function () {
            return this.entity.get();
        }

    });

});
