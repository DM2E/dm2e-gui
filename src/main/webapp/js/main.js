// Filename: main.js


require.config({
    // Set up modules
    paths : {
        jquery : '../vendor/jquery/jquery',
        underscore : '../vendor/lodash/lodash',
        backbone : '../vendor/backbone/backbone',
        text : '../vendor/requirejs-text/text',
        log4javascript : '../vendor/log4javascript/log4javascript',

        bootstrap : '../vendor/bootstrap-css/js/bootstrap',

        backbone_relational : '../vendor/backbone-relational/backbone-relational',
        backbone_bootstrap_modal : '../vendor/backbone.bootstrap-modal/src/backbone.bootstrap-modal',

        // for drag/drop
        jquery_ui : '../vendor/jquery-ui/ui/jquery-ui',

        // for file uploads
        'jquery.ui.widget' : '../vendor/jquery-file-upload/js/vendor/jquery.ui.widget',
        bootstrap_jasny_fileupload : '../vendor/bootstrap-jasny/js/bootstrap-fileupload',
        jquery_iframe_transport : '../vendor/jquery-file-upload/js/jquery.iframe-transport.js',
        jquery_file_upload: '../vendor/jquery-file-upload/js/jquery.fileupload',

        // for notifications
        bootstrap_notify : '../vendor/bootstrap-notify/js/bootstrap-notify',

        // utility
        uuid : '../vendor/node-uuid/uuid',
        humaneDate : "../vendor/humane-dates/humane",
        sorttable : "../vendor/sorttable",

        // shortcut to HTML templates
        templates : '../templates',

        BaseView : "views/BaseView",
        BaseModel : "models/BaseModel",
        RelationalModel : "models/RelationalModel",
        BaseCollection : "collections/BaseCollection",

    },
    
    // http://requirejs.org/docs/api.html#config-shim
    shim : {
        'humaneDate' : {
          exports : 'humaneDate',
        },
        'backbone' : {
            deps : [ 'underscore', 'jquery' ],
            exports : 'Backbone'
        },
        'jquery_ui' : {
            deps : [ "jquery" ]
        },
        'underscore' : {
            exports : '_',
        },
        'sorttable' : {
            exports : 'sorttable'
        },
        'log4javascript' : {
            exports : 'log4javascript'
        },
        'bootstrap' : {
            deps : [ "jquery" ]
        },
        'backbone_relational' : {
            deps :  [ 'backbone' ],
            exports : 'Backbone.RelationalModel',
        },
        'backbone_bootstrap_modal' : {
            deps : ['backbone'],
            exports : 'Backbone.Modal',
        },
        'bootstrap_jasny_fileupload' : {
            deps : [ 'jquery' ],
        },
        // 'jquery_file_upload' : {
            // deps : [
                // 'jquery_ui',
                // 'jquery.ui.widget',
                // 'bootstrap_jasny_fileupload',
                // 'jquery.ui.widget' 
            // ],
            // // exports : "jquery.ui.widget",
        // },
        'bootstrap_notify' : {
            deps : [ 'jquery' ],
        }

    }

});

// Wrap Backbone sync for debugging
// Actually start the whole thing
require([
    'router',
    'views/app',
    'vm',
    'sorttable',
    'util/backbone.sync',
], function(Router, AppView, Vm, sorttable) {

    sorttable.init();

    var appView = Vm.createView({}, 'AppView', AppView);
    appView.render();

    var router = Router.initialize({
        appView : appView
    }); // The router now has a copy of all main appview
    Vm.setRouter(router);
});
