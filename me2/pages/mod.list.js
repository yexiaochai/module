define([
    'ModuleView',
    'pages/list.data',
    'text!pages/tpl.list.html'

], function (ModuleView,
             listData,
             tpl) {
    return _.inherit(ModuleView, {
        props:['entity'],

        //此处若是要使用model，处实例化时候一定要保证entity的存在，如果不存在便是业务BUG
        initData: function () {

            this.template = tpl;
            this.entity.subscribe(this.render, this);

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
            var sort = this.entity.get();

            for (var k in sort) {
                if (sort[k].length > 0) {
                    tmp = this['_' + k + 'Sort'](data, sort[k])
                    return tmp;
                }
            }
        },

        //复杂的业务数据处理,为了达到产品的需求,这段代码逻辑与业务相关
        //这段数据处理的代码过长(超过50行就过长),应该重构掉
        formatData: function (data) {
            var item, seat;
            var typeMap = {
                'g': 'g',
                'd': 'd',
                't': 't',
                'c': 'g'
            };

            //出发时间对应的分钟数
            var fromMinute = 0;

            //获取当前班车日期当前的时间戳,这个数据是动态的,这里写死了
            var d = 1464192000000;
            var date = new Date();
            var now = parseInt(date.getTime() / 1000);
            date.setTime(d);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var toBegin;
            var seatName, seatIndex, iii;

            //处理坐席问题，仅显示二等座，一等座，特等座 无座
            //                二等座 一等座 商务座 无座 动卧 特等座
            var my_seats = {};
            var seatSort = ['二等座', '一等座', '硬座', '硬卧', '软卧', '商务座', '无座', '动卧', '特等座', '软座'];

            for (var i = 0, len = data.length; i < len; i++) {
                fromMinute = data[i].from_time.split(':');
                fromMinute[0] = fromMinute[0] + '';
                fromMinute[1] = fromMinute[1] + '';
                if ((fromMinute[0].charAt(0) == '0')) fromMinute[0] = fromMinute[0].charAt(1);
                if ((fromMinute[1].charAt(0) == '0')) fromMinute[1] = fromMinute[1].charAt(1);
                date = new Date(year, month, day, fromMinute[0], fromMinute[1], 0);
                fromMinute = parseInt(date.getTime() / 1000)
                toBegin = parseInt((fromMinute - now) / 60);

                data[i].toBegin = toBegin;

                //处理车次类型问题
                data[i].my_train_number = typeMap[data[i].train_number.charAt(0).toLowerCase()] || 'other';

                seat = data[i].seats;
                //所有余票
                data[i].sum_ticket = 0;
                //最低价
                data[i].min_price = null;

                for (var j = 0, len1 = seat.length; j < len1; j++) {
                    if (!data[i].min_price || data[i].min_price > seat[j].seat_price) data[i].min_price = parseFloat(seat[j].seat_price);
                    data[i].sum_ticket += parseInt(seat[j].seat_yupiao);

                    //坐席问题如果坐席不包括上中下则去掉
                    seatName = seat[j].seat_name;
                    //去掉上中下
                    seatName = seatName.replace(/上|中|下/g, '');
                    if (!my_seats[seatName]) {
                        my_seats[seatName] = parseInt(seat[j].seat_yupiao);
                    } else {
                        my_seats[seatName] = my_seats[seatName] + parseInt(seat[j].seat_yupiao);
                    }
                }
                //这里myseat为对象，需要转换为数组
                //将定制坐席转为排序后的数组
                data[i].my_seats = [];
                for (iii = 0; iii < seatSort.length; iii++) {
                    if (typeof my_seats[seatSort[iii]] == 'number') data[i].my_seats.push({
                        name: seatSort[iii],
                        yupiao: my_seats[seatSort[iii]]
                    });
                }

                my_seats = {};
            }

            return data;
        },

        //完成所有的筛选条件，逻辑比较重
        getViewModel: function () {
            var data = this.formatData(listData);
            data = this.getSortData(data);
            return {data: data};
        }

    });

});
