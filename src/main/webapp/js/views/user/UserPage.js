//Filename: UserPage.js

define([
    'jquery',
    'underscore',
    'BaseView',
    'logging',
    'singletons/UserSession',
    'text!templates/user/userPageTemplate.html'
], function($,
    _,
    BaseView,
    logging,
    userSession,
    userPageTemplate) {

    var log = logging.getLogger("UserPage.js");

    return BaseView.extend({

        template : userPageTemplate,

        initialize : function() {
            // this.model = userSession.user;
        }

    });
});
