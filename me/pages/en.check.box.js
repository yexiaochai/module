define(['AbstractEntity'], function (AbstractEntity) {

    var Entity = _.inherit(AbstractEntity, {
        propertys: function ($super) {
            $super();
            this.data = [];
        },

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
            if (!noEvent) this.update();
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

            if (!noEvent) this.update();
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

        initData: function (data) {
            this.data = data;
        }

    });

    return Entity;
});
