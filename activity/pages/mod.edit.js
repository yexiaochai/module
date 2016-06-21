define(['ModuleView', 'text!pages/tpl.edit.html'], function (ModuleView, template) {
    return _.inherit(ModuleView, {

        //此处若是要使用model，处实例化时候一定要保证entity的存在，如果不存在便是业务BUG
        initData: function () {

            this.template = template;
            this.events = {
                'click .js-add': 'addAction',
                'click .js-delete': 'deleteAction',
                'click .js-ok': 'saveAction'
            };

        },

        deleteAction: function(e) {
            var el = $(e.currentTarget);
            el.parent().remove();
        },

        addAction: function () {
            var item = [
                '<div class="form-item">',
                    '<label class="field-label btn js-delete">删除</label>',
                    '<input type="text" value="投票项目" class="field-text js-item">',
                '</div>'
            ].join('');
            this.$('.js-edit .form').append(item);

        },

        saveAction: function() {

            var items = this.$('.js-item');
            var data = [];
            var el;

            for(var i = 0, len = items.length; i < len; i++) {
                el = items.eq(i);
                data.push(el.val());
            }

            console.log(data);
            this.entity.setItems(data);

            this.widgetsEntity.update();

        },

        getViewModel: function () {
            return  { data: this.entity.getItems() };
        }

    });

});
