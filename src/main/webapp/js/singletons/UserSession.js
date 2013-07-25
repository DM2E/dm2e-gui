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
        "omnom:fileservice": _.map([ 
                                   'file',
                                   // Comment that one out for testing
                                   // 8< snip
                                   'mint-file',
                                   // >8 snap
        ], function(id) {
            return {id : SERVICE_URLS.BASE + id };
        }),
        "omnom:webservice": _.map([
                                 'service/xslt',
                                 'service/xslt-zip',
                                 'publish',
                                 'service/demo'
        ], function(id) {
            return {id: SERVICE_URLS.BASE + id};
        })
    };

    /*
     * Determine user ID
     */
    var userID;
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


    /*
     * Load the user model, create it if necessary
     */
    var userModel = new UserModel();
    userModel.url = userID;
    userModel.set("id", userID);
    console.error(userModel);

    var jsonResp;
    userModel.fetch({
        // url: userID,
        async: false,
        // dataType: "json",
        complete : function(jqXHR) {
            if (jqXHR.status === 200) {
                log.debug("Successfully fetched user " + userID + " from server.");
                jsonResp = jqXHR.responseText;
            } else {
              log.warn("Creating user");
              userModel.setQN("foaf:name", UriUtils.last_url_segment(userID));
              userModel.setQN("omnom:preferredTheme", "dark");
              _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
                  _.each(defaultServices[rel], function(bareModel){
                      userModel.getQN(rel).add(bareModel);
                  });
              });
              // if (userModel.getQN("foaf:name") !== 'the-test-user'){
                  userModel.save();
              // }
              // window.location.reload();
              console.warn("Newly built user model before expansion: ", userModel.toJSON());
          }
          _.each(["omnom:fileservice", "omnom:webservice"], function(rel) {
              _.each(userModel.getQN(rel).models, function(bareModel){
                  bareModel.url = bareModel.id+ "/describe";
                  bareModel.fetch({async: false});
              });
          });
          console.warn("User model after expansion: ", userModel.toJSON());
      }
    });

    console.warn("Expanded user model: ", userModel);

    var UserSession = RelationalModel.extend({
        toJSON : function() { return { user : this.get("user").toJSON() }; }
    });
    var session = new UserSession({
    user :  userModel
    });
    themeSwitcher.setTheme(session.get("user").getQN("omnom:preferredTheme"));
    return session;
});
