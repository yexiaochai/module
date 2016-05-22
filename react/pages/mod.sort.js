define([
    'Vue',
    'text!pages/tpl.sort.html'
], function (Vue,
             template) {

    return Vue.extend({
        props: ['sort'],
        methods: {
            _resetData: function () {
                this.sort.time = '';
                this.sort.sumTime = '';
                this.sort.price = '';
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
                if (this.sort[key] != '') {
                    if (this.sort[key] == 'up') this.sort[key] = 'down';
                    else this.sort[key] = 'up';
                } else {
                    this._resetData();
                    this.sort[key] = 'down';
                }
            }
        },
        template: template

    });

});
