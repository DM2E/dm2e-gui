define([
       'underscore',
       'MAIN/constants/RDFNS',
       'MAIN/singletons/UserSession',
       'MAIN/collections/workflow/WebserviceCollection',
       'MAIN/views/workflow/WebserviceListView',
], function(
    _,
    NS,
    session,
    WebserviceCollection,
    WebserviceListView
){
    return function() {
        module('WebserviceListView');

        var $fixture = $("#qunit-fixture");

        asyncTest("foo", 2, function() {
            var wsColl = new WebserviceCollection(NS.rdf_attr("omnom:webservice", session));
            console.log(wsColl);
            var view = new WebserviceListView({
                collection : wsColl,
            });
            view.setElement($fixture);
            // view.collection.add(session.services);
            view.render();
            view.renderCollection();
            setTimeout(function() {
                ok($fixture.html(), "HTML is not empty");
                equal($(".webservice", $fixture).length, 4);
                console.log($(".webservice", $fixture));
                console.log($fixture.html());
                start();
            }, 20);
        });
    };
});
