define([
    'ui/ui.view'
], function (
    UIView
) {

    return _.inherit(UIView, {

        setRootStyle: function () {
            this.$el.addClass('cm-overlay');
        },

        addEvent: function ($super) {
            $super();

            this.on('onShow', function () {
                this.setRootStyle();
                this.setzIndexTop();
            });

        }

    });

});
