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
            this.update();
        },

        setIndex: function (i, noEvent) {
            if (typeof i === 'string') i = parseInt(i);
            if (i < 0 || i > this.getLength()) return;
            this.unCheckAll();
            this.data[i].checked = true;
            if (!noEvent) this.update();
        },

        setId: function(id) {

            for(var i = 0, len = this.getLength(); i < len; i++) {
                if(this.data[i].id == id) {
                    this.setIndex(i);
                    return;
                }
            }
        },

        getCheckedIndex: function () {
            for (var i = 0, len = this.getLength(); i < len; i++) {
                if (this.data[i].checked) return i;
            }
            return null;
        },

        getCheckedKey: function () {
            var index = this.getCheckedIndex();
            if (index !== null) return this.data[index].id;
            return null;
        },

        getCheckedName: function () {
            var index = this.getCheckedIndex();
            if (index !== null) return this.data[index].name;
            return null;
        }

    });

    return Entity;
});
