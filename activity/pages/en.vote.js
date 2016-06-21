define(['AbstractEntity'], function (AbstractEntity) {

    var Entity = _.inherit(AbstractEntity, {
        propertys: function ($super) {
            $super();
            this.data = {
                items: [
                    '投票项目1',
                    '投票项目2',
                    '投票项目3'
                ],
                //收集投票结果
                results: [0, 0, 0]
            };
        },

        getItems: function () {
            return this.data.items;
        },

        setItems: function(data) {
            this.data.items = data;
            this.update();
        }

    });

    return Entity;
});
