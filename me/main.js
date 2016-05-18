(function () {

    require.config({
        paths: {
            'text': 'libs/require.text',

            'AbstractView': 'js/view',
            'AbstractEntity': 'js/entity',
            'ModuleView': 'js/module'


        }
    });

    require(['pages/list'], function (List) {

        var list = new List();
        list.show();

    });

})();
