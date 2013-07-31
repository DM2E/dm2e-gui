define([ 
       'underscore',
       'logging',
       '../constants/RDFNS',
       '../models/user/UserModel',
       '../singletons/UserSessionBuilder',
       '../constants/SERVICE_URLS',
], function(_,
    logging,
    NS,
    UserModel,
    UserSessionBuilder,
    SERVICE_URLS
) {

  var NR_FILESERVICES = 1,
      NR_WEBSERVICES = 4;
  var NR_TOTAL = NR_FILESERVICES + NR_WEBSERVICES;

    return function() {
        module("UserSessionBuilderTest");

        test("user helper functions", function() {
            var testsess = new UserSessionBuilder();
            equal(testsess.determineUserID(),
                  SERVICE_URLS.userService + "the-test-user",
                  "User name is detected");
            ok(testsess.findOrCreateUser(),
               "User is found or created");
            equal(testsess.findOrCreateUser().id,
                  SERVICE_URLS.userService + "the-test-user",
                  "User is loaded");
        });
        test("initialize session", function() {
            var sess = UserSessionBuilder.prototype.initSession();
            ok(sess, "Initialized");
            equal(_.keys(sess.services).length, NR_TOTAL, "# of services total");
            equal(NS.rdf_attr("omnom:fileservice", sess).length, NR_FILESERVICES, "# of fileservices");
            equal(NS.rdf_attr("omnom:webservice", sess).length, NR_WEBSERVICES, "# of webservices");
            ok(sess.cacheService(SERVICE_URLS.BASE + "file"));
        });

    };
});
