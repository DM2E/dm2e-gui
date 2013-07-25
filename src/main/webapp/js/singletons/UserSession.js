//Filename: UserSession.js

define([
	'jquery',
	'underscore',
	'backbone',
    'RelationalModel',
	'logging',
	'constants/RDFNS',
    'constants/SERVICE_URLS',
	'util/dialogs',
    'util/themeSwitcher',
    'util/UriUtils',
	'models/user/UserModel'
], function($,
	_,
	Backbone,
    RelationalModel,
	logging,
	NS,
    SERVICE_URLS,
	dialogs,
    themeSwitcher,
    UriUtils,
	UserModel) {

	var log = logging.getLogger("sessions.UserSession");

    var defaultServices = {
        "omnom:fileservice": [
            {id: SERVICE_URLS.BASE  + 'file'},
            // Comment that one out for testing
            // 8< snip
//        {id: SERVICE_URLS.BASE + 'mint-file'},
            // >8 snap
        ],
        "omnom:webservice": [
            {id: SERVICE_URLS.BASE + 'service/xslt'},
            {id: SERVICE_URLS.BASE + 'service/xslt-zip'},
            {id: SERVICE_URLS.BASE + 'publish'},
            {id: SERVICE_URLS.BASE + 'service/demo'},
        ]};

	var userID;

    /*
     * Determine user ID
     */
	$.ajax({
	    url : SERVICE_URLS.userService + "_username",
	    async : false,
	    success : function(data) {
	        userID = data;
        },
	    error : function(jqXHR) {
	        dialogs.errorXHR(jqXHR, "Authentication error to " + SERVICE_URLS.userService + "/_username");
	        return;
        },
    });

    log.debug("User detected to be " + userID);


    // Load the user model
    var userModel = new UserModel();
    userModel.url = userID;
    userModel.fetch({
        async: false,
        success : function() {
            log.debug("Successfully fetched user " + userID + " from server.");
            console.error(userModel.toJSON());
            log.debug("Fetching webservices");
        },
        error : function() {
            log.warn("Creating user");

            userModel.set("id", userID);

            userModel.setQN("foaf:name", UriUtils.last_url_segment(userID));
            userModel.setQN("omnom:preferredTheme", "dark");
            _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
                _.each(defaultServices[rel], function(serviceUrlFragment) {
                    userModel.getQN(rel).add(serviceUrlFragment);
                })
            });
            if (userModel.getQN("foaf:name") !== 'the-test-user'){
                userModel.save();
            }
        }
    });

    // Expand all the services (FIXME quite a performance hit ofc)
    _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
        _.each(userModel.getQN(rel).models, function(modelToExpand) {
            modelToExpand.url = modelToExpand.id + "/describe";
            modelToExpand.fetch({async:false});
        });
    });

	var UserSession = RelationalModel.extend({
        toJSON : function() { return { user : this.get("user").toJSON() } }
    });
	var session = new UserSession({
		user :  userModel
	});
    themeSwitcher.setTheme(session.get("user").getQN("omnom:preferredTheme"));
	return session;
});