define([
    'Vue',
    'text!pages/tpl.list.html'
], function (Vue,
             template) {

    return Vue.extend({
        props: ['data'],
        data: function() {
           return {
               mapping: {
                   'g': '高速',
                   't': '特快',
                   'd': '高速动车',
                   'c': '城际高铁',
                   'z': '直达'
               }
           };
        },
        template: template

    });

});
