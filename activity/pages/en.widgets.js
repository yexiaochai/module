define(['AbstractEntity'], function (AbstractEntity) {

    var Entity = _.inherit(AbstractEntity, {
        propertys: function ($super) {
            $super();

            //所有的组件集合
            this.data = [];
        },

        getWidgets: function () {
            return this.data;
        },

        //暂时不支持排序
        pushWidget: function(item) {
            this.data.push(item);
            this.update();
        },

        //暂不实现
        removeWidget: function () {

        },

        getItem: function(i) {
          return this.data[i];
        },

        setWidget: function(data) {
            this.data = data;
            this.update();
        }

    });

    return Entity;
});
