define(['AbstractEntity'], function (AbstractEntity) {

    var Entity = _.inherit(AbstractEntity, {
        propertys: function ($super) {
            $super();

            //三个对象，时间，耗时，架构，升序降序，三个数据互斥
            //默认down up null
            this.data = {
                time: 'up',
                sumTime: '',
                price: ''
            };
        },

        _resetData: function () {
            this.data = {
                time: '',
                sumTime: '',
                price: ''
            };
        },

        setTime: function () {
            this._setData('time');
        },

        setSumTime: function () {
            this._setData('sumTime');
        },

        setPrice: function () {
            this._setData('price');
        },

        _setData: function (key) {

            //如果设置当前key存在，则反置，否则清空筛选，设置默认值
            if (this.data[key] != '') {
                if (this.data[key] == 'up') this.data[key] = 'down';
                else this.data[key] = 'up';
            } else {
                this._resetData();
                this.data[key] = 'down';
            }
            this.update();
        }

    });

    return Entity;
});
