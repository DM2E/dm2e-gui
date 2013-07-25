//Filename: UserModel.js

define([
	'jquery',
	'underscore',
	'BaseModel',
	'RelationalModel',
	'logging',
	'constants/RDFNS',
	'models/workflow/WebserviceModel',
	'collections/workflow/WebserviceCollection'
], function($,
	_,
	BaseModel,
	RelationalModel,
	logging,
	NS,
	WebserviceModel,
	WebserviceCollection) {

	var log = logging.getLogger("models.user.UserModel");
//	theDefaults[NS.getQN("omnom:webservice")] = new WebserviceCollection();

	return RelationalModel.extend({

		relations : [
            {
                type : Backbone.HasMany,
                key : NS.getQN("omnom:webservice"),
                //includeInJSON: "id",
                createModels: true,
                relatedModel : WebserviceModel,
            },
            {
                type : Backbone.HasMany,
                key : NS.getQN("omnom:fileservice"),
                //includeInJSON: "id",
                createModels: true,
                relatedModel : WebserviceModel,
            },

        ],
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
