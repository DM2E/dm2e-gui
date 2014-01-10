//Filename: UserModel.js

define([
	'jquery',
	'underscore',
	'BaseModel',
	'RelationalModel',
	'logging',
	'constants/RDFNS',
	'constants/SERVICE_URLS',
	'models/workflow/WebserviceModel',
	'collections/workflow/WebserviceCollection'
], function($,
	_,
	BaseModel,
	RelationalModel,
	logging,
	NS,
	SERVICE_URLS,
	WebserviceModel,
	WebserviceCollection) {

	var log = logging.getLogger("models.user.UserModel");
	var theDefaults = {};
    NS.rdf_attr("rdf:type", theDefaults, NS.expand("foaf:Person"));
    NS.rdf_attr("omnom:preferredTheme", theDefaults, "dark");
    NS.rdf_attr("omnom:fileservice", theDefaults, _.map([
            'file',
            'mint-file', // Comment that one out for testing
    ], function(id) {
        return SERVICE_URLS.BASE + id;
    }));
    NS.rdf_attr("omnom:webservice", theDefaults, _.map([
            'service/xslt',
            'publish',
            'service/zip-iterator',
            'service/demo'
    ], function(id) {
        // console.log(SERVICE_URLS.BASE);
        return SERVICE_URLS.BASE + id;
    }));

	return BaseModel.extend({

        defaults : theDefaults,

        // toJSON : function() {
        //     jsonObj = _.clone(this.attributes);
        //     if (this.id) jsonObj.id = this.id;
        //     this.uuid = this.cid;
        //     _.each(["omnom:webservice", "omnom:fileservice"], function(rel) {
        //         NS.rdf_attr(rel, jsonObj, _.map(this.getQN(rel).models, function(ws){
        //             return (ws.toJSON());
        //         }));
        //     }, this);
        //     // this[NS.expand("omnom:webservice")] = 
        //     return jsonObj;
        // },

		// relations : [
            // {
                // type : Backbone.HasMany,
                // key : NS.getQN("omnom:webservice"),
                // includeInJSON: "id",
                // // createModels: true,
                // // autoFetch: true,
                // relatedModel : WebserviceModel,
                // collectionType: WebserviceCollection,
            // },
            // {
                // type : Backbone.HasMany,
                // key : NS.getQN("omnom:fileservice"),
                // includeInJSON: "id",
                // // createModels: true,
                // // autoFetch: true,
                // relatedModel : WebserviceModel,
                // collectionType: WebserviceCollection,
            // },
        // ],

        parse : function(data) {
            _.each(["omnom:webservice", "omnom:fileservice"], function(rel) {
                NS.rdf_attr(rel, data, _.map(NS.rdf_attr(rel, data), function(ws) {
                    return ws.id;
                }));
            });
            return data;
        }

        // },
//		initialize : function() {
//			_.each(this.get("serviceList"), function(serviceURL) {
//				var service = new WebserviceModel({id : serviceURL});
//				service.url = serviceURL;
//				service.fetch();
//				this.getQN("omnom:webservice").add(service);
//			}, this);
//		}
	});
});
