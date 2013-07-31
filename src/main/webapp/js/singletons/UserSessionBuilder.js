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

    var UserSession = function() {

        this.determineUserID = function() {
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
                    window.location.hash = 'home';
                },
            });
            return userID;
        };

        this.findOrCreateUser = function() {
            var userID = this.determineUserID();
            user = new UserModel({ id : userID });
            user.fetch({
                async:false,
                complete : function(jqXHR) {
                    if (jqXHR.status === 200) {
                        log.debug("Successfully fetched user " + userID + " from server.");
                    } else {
                        log.warn("Creating user");
                        user.setQN("foaf:name", UriUtils.last_url_segment(user.id));
                        user.save();
                    }
                },
            });
            this.user = user;
            return user;
        };

        this.cacheService = function(id, category) {
            category = category ? category : NS.expand('omnom:webservice');
            this.services = this.services || {};
            this.services[id] = WebserviceModel.findOrCreate({ id : id });
            this.services[id].url = id + "/describe";
            this.services[id].fetch({async:false});
            this[category] = this[category] || [];
            this[category].push(this.services[id]);
            return true;
        };

        this.cacheUserServices = function() {
            var user = this.user;
            if (typeof user === 'undefined') {
                throw "No user in the session, nothing to cache :(";
            }
            var userJSON = user.toJSON();
            var that = this;
            _.each(["omnom:webservice", "omnom:fileservice"], function(rel) {
                NS.rdf_attr(rel, userJSON, _.each(NS.rdf_attr(rel, userJSON), function(ws) {
                    that.cacheService(ws, NS.expand(rel));
                }));
            });
        };

        this.toJSON = function() {
            var retJSON = {
                user : this.user.toJSON(),
                services : {}
            };
            _.each(this.services, function(val, key) {
                retJSON.services[key] = val.toJSON();
            });
            return retJSON;
        };
    };
    UserSession.prototype.initSession = function() {
        var session = new UserSession();
        session.findOrCreateUser();
        session.cacheUserServices();
        themeSwitcher.setTheme(session.user.getQN("omnom:preferredTheme"));
        return session;
    };
    return UserSession;
});
