(function () {

    require.config({
        paths: {
            'text': 'libs/require.text',
            'AbstractView': 'js/view',

            'Vue': 'libs/vue'


        }
    });

    require(['pages/list'], function (VueList) {

    });

})();
