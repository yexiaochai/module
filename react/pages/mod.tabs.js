define([
    'Vue',
    'text!pages/tpl.tabs.html',
    'ui/ui.list'
], function (Vue,
             template,
             UILayerList) {

    return Vue.extend({
        props: ['data', 'name'],
        data: function() {
          return {
              className: ''
          }
        },
        methods: {

            getLength: function () {
                return this.data.length;
            },

            unCheckAll: function () {
                for (var i = 0, len = this.getLength(); i < len; i++) {
                    this.data[i].checked = false;
                }
            },

            checkAll: function (noEvent) {
                if (this.getLength() == 0) return;
                this.unCheckAll();
                this.data[0].checked = true;
                //if (!noEvent) this.update();
            },

            setIndex: function (i, noEvent) {
                if (typeof i === 'string') i = parseInt(i);
                if (i < 0 || i > this.getLength()) return;
                if (i === 0) {
                    this.checkAll(noEvent);
                    return;
                }
                this.data[0].checked = false;
                if (this.data[i].checked) this.data[i].checked = false;
                else this.data[i].checked = true;

                //如果除了第一个都被选了的话，那么就是全选，如果全部没被选也得全选
                if (this.getCheckedIndex().length == this.getLength() - 1 || this.getCheckedIndex().length == 0) {
                    this.checkAll(noEvent);
                }

                //if (!noEvent) this.update();
            },

            getCheckedIndex: function (index) {
                var indexArr = [];
                for (var i = 0, len = this.getLength(); i < len; i++) {
                    if (index === i && this.data[i].checked) continue;
                    if (this.data[i].checked) indexArr.push(i);
                }
                return indexArr;
            },

            getCheckedKey: function () {
                if (this.data[0].checked) return null;
                var checed = [], index = this.getCheckedIndex();
                for (var i = 0, len = index.length; i < len; i++) {
                    checed.push(this.data[index[i]].id);
                }
                return checed;
            },


            showLayer: function() {
                var data = this.data;
                var scope = this;

                if(!data) return;

                this.className = 'active';

                if (this.layer && this.layer.status == 'show') return;

                if (!this.layer) {

                    //这里注释了车站地图需求
                    this.layer = new UILayerList({
                        list: data,
                        events: {
                            'click .js_ok': function () {
                                this.hide();
                            }
                        },
                        onHide: function () {
                            scope.className = '';

                        },
                        title: '<span class="fl js_cancel" style="font-weight: 500;">取消</span><span class="fr js_ok" style="color: #00b358; font-weight: 500;">确定</span>',
                        itemFn: function (item) {
                            return '<div style="text-align: left; padding-left: 10px; ">' + item.name + '</div>';
                        },
                        setIndex: function (i) {
                            scope.setIndex(i, true);
                            this.setIndexArr();
                        },
                        setIndexArr: function () {
                            var indexArr = scope.getCheckedIndex();

                            if (typeof indexArr == 'number') indexArr = [indexArr];
                            this.$('li').removeClass(this.curClass);
                            for (var i = 0, len = indexArr.length; i < len; i++) this._setIndex(indexArr[i])
                        },
                        _setIndex: function (i) {
                            if (i < 0 || i > this.list.length) return;
                            this.index = i;
                            this.$('li[data-index="' + i + '"]').addClass(this.curClass);
                        }
                    });
                } else {
                    this.layer.list = data;
                    this.layer.refresh();
                }

                this.layer.show();
                this.layer.setIndexArr();

            },

            hideLayer: function() {

            }
        },
        template: template

    });

});
