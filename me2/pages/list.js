define([
    'AbstractView',
    'pages/en.sort',
    'pages/mod.sort',
    'pages/mod.list',
    'text!pages/tpl.layout.html',
    'text!pages/tpl.list.html'

], function (AbstractView,
             SortEntity,
             SortModule,
             ListModule,
             layoutHtml,
             listTpl) {
    return _.inherit(AbstractView, {

        initEntity: function () {
            //实例化排序的导航栏的实体
            this.sortEntity = new SortEntity();
            this.sortEntity.subscribe(this.renderList, this);
        },

        initModule: function () {
            //view为注入给组件的根元素
            //selector为组件将要显示的容器
            //sortEntity为注入给组件的数据实体,做通信用
            //这个module在数据显示后会自动展示
            this.sortModule = new SortModule({
                view: this,
                selector: '.js_sort_wrapper',
                sortEntity: this.sortEntity
            });
            this.listModule = new ListModule({
                view: this,
                selector: '.js_list_wrapper',
                entity: this.sortEntity
            });
        },

        propertys: function ($super) {
            $super();

            this.viewId = 'list';
            this.template = layoutHtml;
            this.events = {};
        }
    });

});
