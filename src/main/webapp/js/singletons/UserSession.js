//Filename: UserSession.js

define([
	'jquery',
	'underscore',
	'backbone',
	'logging',
	'constants/RDFNS',
    'constants/SERVICE_URLS',
	'util/dialogs',
    'util/themeSwitcher',
	'models/user/UserModel'
], function($,
	_,
	Backbone,
	logging,
	NS,
    SERVICE_URLS,
	dialogs,
    themeSwitcher,
	UserModel) {

	var log = logging.getLogger("sessions.UserSession");

    var defaultFileServices = [
        'file',
        // Comment that one out for testing
        'mint-file'
        // snip
    ];
    var defaultWebservices = [
        'service/xslt',
        'service/xslt-zip',
        'publish',
        'service/demo'
    ];

	var username;

//    console.error(SERVICE_URLS.userService + "_username");
	$.ajax({
	    url : SERVICE_URLS.userService + "_username",
	    async : false,
	    success : function(data) {
	        username = data;
        },
	    error : function(jqXHR) {
	        dialogs.errorXHR(jqXHR, "Authentication error to " + SERVICE_URLS.userService + "/_username");
	        return;
        },
    });

    var userURI = SERVICE_URLS.userService + username;
    console.log(userURI);

    var TheUserModel = UserModel.extend({
        url : userURI
    });
    var userModel = new TheUserModel();
    userModel.fetch({
        async: false,
        success : function() {
            log.debug("Successfully fetched user " + userURI + " from server.");
        },
        error : function() {
            log.warn("Creating user");

            userModel.set("id", userURI);

            userModel.setQN("foaf:name", username);
            userModel.setQN("omnom:preferredTheme", "dark");

            userModel.setQN("omnom:fileservice", []);
            _.each(defaultFileServices, function(fs) {
                console.error("Retrieving " + SERVICE_URLS.BASE + fs);
                $.ajax({
                    url : SERVICE_URLS.BASE + fs + "/describe",
                    async: false,
                    dataType : "json",
                    success: function(data) {
                        userModel.getQN("omnom:fileservice").push(data);
                    },
                    error : function(jqXHR) { dialogs.errorXHR(jqXHR) },

                })
//                console.error(userModel.getQN("omnom:fileservice"));
            });

            userModel.setQN("omnom:webservice", []);
            _.each(defaultWebservices, function(ws) {
                console.error("Retrieving " + SERVICE_URLS.BASE + ws);
                $.ajax({
                    url : SERVICE_URLS.BASE + ws + "/describe",
                    async: false,
                    dataType : "json",
                    success: function(data) {
                        userModel.getQN("omnom:webservice").push(data);
                    },
                    error : function(jqXHR) { dialogs.errorXHR(jqXHR) },

                })
//                console.error(userModel.getQN("omnom:webservice"));
            });

            userModel.save();
        }
    });

	var UserSession = Backbone.Model.extend({

    });

	var session = new UserSession({
		user :  userModel
	});
    themeSwitcher.setTheme(session.get("user").getQN("omnom:preferredTheme"));
	return session;
});
