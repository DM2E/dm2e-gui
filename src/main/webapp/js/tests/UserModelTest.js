define([ 
       'logging',
       '../constants/RDFNS',
       '../constants/SERVICE_URLS',
       '../models/user/UserModel'
], function(
    logging,
    NS,
    SERVICE_URLS,
    UserModel) {

    log = logging.getLogger("tests.UserModel");

    var userId = SERVICE_URLS.BASE + "user/DOESNOTEXIST";

    var removeDummmyUser = function() {
        $.ajax({
            async : false,
            url : userId, 
            type : "delete",
            complete: function(jqXHR){
                log.debug("User deleted");
                log.debug(jqXHR.status);
            }
        });
    };


    return function() {

        module("models/UserModel",{
            setup : removeDummmyUser,
            teardown : removeDummmyUser,
        });

        test("UserModel defaults", function() {
            var um = new UserModel();
            ok(um.getQN("omnom:preferredTheme"), "dark");
            equal(um.getQN("rdf:type"), NS.expand("foaf:Person"));
            equal(um.getQN("omnom:fileservice").length, 2);
            equal(um.getQN("omnom:webservice").length, 4);
            console.log(um.toJSON());
        });

        asyncTest("Fetch non-existing", function() {
            expect(2);
            var um = new UserModel({
                id : userId
            });
            um.fetch({
                complete : function(jqXHR) {
                    equal(jqXHR.status, 404);
                    ok(true, 'User not found'); 
                    start(); 
                },
            });
        });

        asyncTest("Create new", function() {
            expect(2);
            var um = new UserModel({
                id: userId,
            });
            console.log(um);
            um.save(null, {
                async : false,
                complete : function(jqXHR) {
                    equal(jqXHR.status,  200);
                    ok(true, 'User Created'); 
                    console.log(um);
                },
            });
            start();
        });

    };
});
