(function () {

    require.config({
        paths: {
            'text': 'libs/require.text',

            'AbstractView': 'js/view',
            'AbstractEntity': 'js/entity',
            'ModuleView': 'js/module'


        }
    });

    require(['pages/demo'], function (Page) {

        var page = new Page();
        page.show();

    });

})();
