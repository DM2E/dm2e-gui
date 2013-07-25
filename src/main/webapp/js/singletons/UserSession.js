//Filename: UserSession.js

define([
	'jquery',
	'underscore',
	'backbone',
  'RelationalModel',
  'models/workflow/WebserviceModel',
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
  WebserviceModel,
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
        complete : function(jqXHR) {
            if (jqXHR.status === 200) {
                log.debug("Successfully fetched user " + userID + " from server.");
                console.error(userModel.toJSON());
            } else {
              log.warn("Creating user");

              userModel.set("id", userID);

              userModel.setQN("foaf:name", UriUtils.last_url_segment(userID));
              userModel.setQN("omnom:preferredTheme", "dark");
              _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
              log.debug("Adding " + rel + " to new user.");
                  _.each(defaultServices[rel], function(serviceUrlFragment) {
                    console.log(userModel.getQN(rel));
                    userModel.getQN(rel).add( new WebserviceModel(serviceUrlFragment) );
                    console.log(userModel.getQN(rel));
                  })
              });
              if (userModel.getQN("foaf:name") !== 'the-test-user'){
                  userModel.save();
              }
              // window.location.reload();
              console.warn("Newly built user model before expansion: ", userModel);
          }
//          log.debug("Fetching webservices");
          // Expand all the services (FIXME quite a performance hit ofc)
//          _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
//              _.each(userModel.getQN(rel).models, function(modelToExpand) {
//                  log.debug("Fetching webservice " + modelToExpand.id);
//                  $.ajax({
//                    async: false,
//                    url: modelToExpand.id + "/describe",
//                    dataType: "json",
//                    success: function(data) {
//                      modelToExpand.set(data);
//                    },
//                  });
//                  console.warn("Webservice fetched: ", modelToExpand);
//              });
//          });
      }
    });

    console.warn("Expanded user model: ", userModel);

    var UserSession = RelationalModel.extend({
        toJSON : function() { return { user : this.get("user").toJSON() } }
    });
    var session = new UserSession({
	user :  userModel
    });
    themeSwitcher.setTheme(session.get("user").getQN("omnom:preferredTheme"));
    return session;
});
