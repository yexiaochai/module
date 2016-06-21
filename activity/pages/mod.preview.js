define(['ModuleView', 'text!pages/tpl.preview.html'], function (ModuleView, preview) {
    return _.inherit(ModuleView, {

        //此处若是要使用model，处实例化时候一定要保证entity的存在，如果不存在便是业务BUG
        initData: function () {

            this.needEmptyRoot = false;
            this.template = preview;

            //当前组件索引,这个代码写的不好
            this.index;

            this.events = {

            };

        },

        setIndex: function(i) {
            this.index = i;
        },

        getViewModel: function () {
            return  { data: this.entity.getItems(), index: this.index };
        }

    });

});
