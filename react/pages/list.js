define([
    'Vue',
    'pages/list.data',
    'pages/mod.list',
    'pages/mod.sort',
    'pages/mod.tabs'

], function (Vue,
             listData,
             ListModule,
             SortModule,
             TabModule) {

    return new Vue({
        components: {
            'my-list': ListModule,
            'my-sort-bar': SortModule,
            'my-tab-item': TabModule
        },
        data: {
            tabClass: {
                type: '1',
                setout: '2'
            },
            data: formatData(listData),
            dataTmp: formatData(listData),
            sort: {
                time: 'up',
                sumTime: '',
                price: ''
            },
            //车次类型
            type: [
                {name: '全部车次', id: 'all', checked: true},
                {name: '高铁城际(G/C)', id: 'g', checked: false},
                {name: '动车(D)', id: 'd', checked: false},
                {name: '特快(T)', id: 't', checked: false},
                {name: '其它类型', id: 'other', checked: false}
            ],
            setout: getSetout()
        },

        methods: {

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
                var sort = this.sort;

                for (var k in sort) {
                    if (sort[k].length > 0) {
                        tmp = this['_' + k + 'Sort'](data, sort[k])
                        return tmp;
                    }
                }
            },

            //根据车次类型做筛选
            getTypeData: function (data) {
                var typeKeys = [];
                var _data = this.type;

                for(var i = 0, len = _data.length; i < len; i++) {
                    if (_data[0].checked) return data;
                    if(_data[i].checked) typeKeys.push(_data[i].id);
                }

                if (!typeKeys) return data;

                var tmp = _.filter(data, function (item) {
                    var no = item.my_train_number;
                    if (_.indexOf(typeKeys, no) != -1) {
                        return true;
                    }
                    return false;
                });

                return tmp;
            },

            onCreate: function() {

                console.log(1)

            },

            //根据出发站做筛选
            //事实上这个方法与getTypeData不是完全不能重构到一起,但是可读性可能会变得晦涩
            getSetoutData: function (data) {
                var typeKeys = [];
                var _data = this.setout;

                for(var i = 0, len = _data.length; i < len; i++) {
                    if (_data[0].checked) return data;
                    if(_data[i].checked) typeKeys.push(_data[i].id);
                }

                if (!typeKeys) return data;

                var tmp = _.filter(data, function (item) {
                    var no = item.from_telecode;
                    if (_.indexOf(typeKeys, no) != -1) {
                        return true;
                    }
                    return false;
                });

                return tmp;
            },

            renderList: function() {
                //这样实现似乎不好
                var data = this.dataTmp;
                data= this.getTypeData(data);
                data= this.getSetoutData(data);
                data= this.getSortData(data);

                this.data = data;

            }

        },

        watch: {
            sort: {
                deep: true,
                handler: function () {
                   this.renderList();
                }
            },
            type: {
                deep: true,
                handler: function() {
                    this.renderList();
                }
            },
            setout: {
                deep: true,
                handler: function() {
                    this.renderList();
                }
            }
        },
        el: '#main'
    });

    //该方法放到这里是否合适?
    function formatData(data) {
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
    }


    //根据列表筛选出发站
    function getSetout() {
        var data = listData;
        var stations = [];
        var stationMap = {};
        var tmp = [{id: 'all', name: '全部出发站', checked: true}];

        for (var i = 0, len = data.length; i < len; i++) {
            stationMap[data[i].from_telecode] = data[i].from_station;
            if (data[i].from_station_type == '起点' && _.indexOf(stations, data[i].from_telecode) == -1) {
                stations.push(data[i].from_telecode);
            }
        }

        for (i = 0, len = stations.length; i < len; i++) {
            var key = stations[i];
            var value = stationMap[key];
            stations[i] = {
                id: key,
                name: value,
                checked: false
            };
        }

        tmp = tmp.concat(stations);

        return tmp;
    }


});
