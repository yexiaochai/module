define([
    'AbstractView', 'pages/en.sort', 'pages/mod.sort', 'pages/mod.list'
], function (AbstractView, SortEntity, SortModule, ListModule) {
    return _.inherit(AbstractView, {
        propertys: function ($super) {
            $super();
            this.$entities = {
                sortEntity: SortEntity
            };
            this.$components = {
                mySortBar: SortModule,
                myList: ListModule
            };
            this.$watch = {

            };

            //根View容器
            this.selector = '#main';
            this.viewId = 'list';
            this.events = {};
        }
    });
});
