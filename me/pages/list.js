define([
    'AbstractView',
    'pages/list.data',

    'pages/en.sort',
    'pages/en.check.box',
    'pages/en.radio.box',

    'pages/mod.sort',
    'pages/mod.check.box',

    'text!pages/tpl.layout.html',
    'text!pages/tpl.list.html'


], function (AbstractView,
             listData,
             SortEntity,
             CheckBoxEntity,
             RadioBoxEntity,
             SortModule,
             CheckBoxModule,
             layoutHtml,
             listTpl) {
    return _.inherit(AbstractView, {

        initEntity: function () {

            //实例化排序的导航栏的实体
            this.sortEntity = new SortEntity();
            this.sortEntity.subscribe(this.renderList, this);

            //车次类型数据实体
            this.trainTypeEntity = new CheckBoxEntity({
                data: [
                    {name: '全部车次', id: 'all', checked: true},
                    {name: '高铁城际(G/C)', id: 'g'},
                    {name: '动车(D)', id: 'd'},
                    {name: '特快(T)', id: 't'},
                    {name: '其它类型', id: 'other'}
                ]
            });
            this.trainTypeEntity.subscribe(this.renderList, this)

            this.setoutEntity = new CheckBoxEntity({
                data: [
                    {name: '全部出发站', id: 'all'}
                ]
            });
            this.setoutEntity.subscribe(this.renderList, this)


            //车次类型数据实体
            this.searchBarEntity = new RadioBoxEntity({
                data: [
                    {name: '车次类型', id: 'type'},
                    {name: '出发站', id: 'setout'},
                    {name: '更多', id: 'more'}
                ]
            });
            this.searchBarEntity.subscribe(this.renderSearchBar, this);


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

            //车次类型模块
            this.trainTypeModule = new CheckBoxModule({
                view: this,
                selector: '.js_type',
                tagname: 'type',
                searchBarEntity: this.searchBarEntity,
                entity: this.trainTypeEntity
            });

            this.setoutModule = new CheckBoxModule({
                view: this,
                selector: '.js_setout',
                tagname: 'setout',
                searchBarEntity: this.searchBarEntity,
                entity: this.setoutEntity
            });

        },

        propertys: function ($super) {
            $super();

            this.initEntity();
            this.initModule();

            this.viewId = 'list';

            this.template = layoutHtml;

            this.events = {};

            //班车信息
            this.listData = listData;

        },

        initElement: function () {
            this.d_list_wrapper = this.$('.js_list_wrapper');
            this.d_none_data = this.$('.js_none_data');

            this.d_js_show_setoutdate = this.$('.js_show_setoutdate');
            this.d_js_show_setstation = this.$('.js_show_setstation');
            this.d_js_show_arrivalstation = this.$('.js_show_arrivalstation');
            this.d_js_list_loading = this.$('.js_list_loading');
            this.d_js_tabs = this.$('.js_tabs');

            this.d_js_day_sec = this.$('.js_day_sec');
            this.d_js_start_sec = this.$('.js_start_sec');
            this.d_js_arrival_sec = this.$('.js_arrival_sec');

        },

        renderSearchBar: function () {
            this.d_js_tabs.find('li').removeClass('active');

            var key = this.searchBarEntity.getCheckedKey();
            if (!key) return;

            var mapping = {
                type: this.trainTypeModule,
                setout: this.setoutModule,
                more: this.moreFilterModule
            };

            for (var k in mapping) {
                if (k != key) mapping[k] && mapping[k].hideLayer();
            }

            this.$('.js_' + key).addClass('active');

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

//根据车次类型做筛选
        getTypeData: function (data) {
            var typeKeys = this.trainTypeEntity.getCheckedKey();
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

//根据出发站做筛选
//事实上这个方法与getTypeData不是完全不能重构到一起,但是可读性可能会变得晦涩
        getSetoutData: function (data) {
            var keys = this.setoutEntity.getCheckedKey();
            if (!keys) return data;

            var tmp = _.filter(data, function (item) {
                var no = item.from_telecode;
                if (_.indexOf(keys, no) != -1)
                    return true;
                return false;
            });

            return tmp;
        },

//完成所有的筛选条件，逻辑比较重
        getFilteData: function () {
            var data = this.formatData(this.listData);
            data = this.getTypeData(data);
            data = this.getSetoutData(data);
            data = this.sortModule.getSortData(data);
            return data;
        },

        //渲染列表
        renderList: function () {
            var data = this.getFilteData();

            var html = '';
            window.scrollTo(0, 0);

            if (data.length === 0) {
                this.d_none_data.show();
                this.d_list_wrapper.hide();
                return;
            }

            this.d_none_data.hide();
            this.d_list_wrapper.show();
            html = this.renderTpl(listTpl, {data: data});
            this.d_list_wrapper.html(html);
        },

//由初始数据筛选出所有出发站
        initSetout: function () {
            var data = this.listData;
            var stations = [];
            var stationMap = {};
            var tmp = [{id: 'all', name: '全部出发站'}];

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
                    name: value
                };
            }

            tmp = tmp.concat(stations);

            this.setoutEntity.initData(tmp);
            this.setoutEntity.checkAll(true);

        },

        addEvent: function () {
            this.on('onShow', function () {

                this.initSetout();
                this.renderList();

            });
        }

    });

});
