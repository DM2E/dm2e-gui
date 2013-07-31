define([ 
       'logging',
       '../constants/RDFNS',
       '../models/user/UserModel',
       '../constants/SERVICE_URLS',
], function(
    logging,
    NS,
    UserModel
) {
    var run = function() {
            console.log(UserModel.prototype.defaults[NS.expand("omnom:fileservice")]);
            console.log(NS.rdf_attr("omnom:fileservice", UserModel.prototype.defaults));

        module("RDFNSTest");

        var compareBasePrefix = "omnom";
        var compareBase = "http://onto.dm2e.eu/omnom/";
        var compareEntity = "Workflow";
        var compare = compareBase + compareEntity;

        test("expand", 4, function() {
            equal(NS.OMNOM().BASE(), compareBase);
            equal(NS.OMNOM().BASE() + compareEntity, compare);
            equal(NS.OMNOM().CLASS_WORKFLOW(), compare);
            equal(NS.expand("omnom:Workflow"), compare);
        });
        test("shorten", 1, function() {
            equal(NS.shorten(NS.expand("omnom:Workflow")), "omnom:Workflow");
        });
        test("rdf_attr", 4, function() {
            theObj = {};
            theObj[NS.expand("omnom:webservice")] = 'foo';
            equal(NS.rdf_attr("omnom:webservice", theObj), 'foo');
            equal(NS.rdf_attr("omnom:workflow", theObj, 'bar'), 'bar');
            throws(function(){NS.rdf_attr("omnom:workflow", undefined);});
            deepEqual( 
                  UserModel.prototype.defaults[NS.expand("omnom:fileservice")],
                  NS.rdf_attr("omnom:fileservice", UserModel.prototype.defaults)
                 );
        });
    };
    return run;
    // return { run : run };

});
