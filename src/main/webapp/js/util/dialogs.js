/** @module util/dialogs */
define([ 'jquery', 'underscore', 'backbone',

//'backboneBootstrapModal', // exports to Backbone.BootstrapModal!
], function($,
	_,
	Backbone) {

	return {

        /**
         * Show a notification
         *
         * @param what The message
         * @param [type] Type of notification (success|error|info)
         */
        notify : function(what, type) {
            type = type || 'success';
            $(".notifications").notify({
                message: { text : type.toUpperCase() + ": " + what },
                fadeOut : { enabled: true },
                type : type,
            }).show();
        },

        errorInvalid :function(what) {
            new Backbone.BootstrapModal({
                title : 'Invalid',
                content : $("<pre>").html(what).html(),
            }).open();
        },

        errorNotFound : function() {
            new Backbone.BootstrapModal({
                content : "404 : Not found.",
            }).open();
        },

		errorNotImplemented : function(what) {
            what = what || "functionality";
			new Backbone.BootstrapModal({
				content : what + " is not yet implemented.",
			}).open();
		},

		errorXHR : function(xhr, message) {
			new Backbone.BootstrapModal({
				title : "Error communicating with server.",
				content : message + "\n Response was " + xhr.status + " " + xhr.statusText,
			}).open();
		}

	};

});
