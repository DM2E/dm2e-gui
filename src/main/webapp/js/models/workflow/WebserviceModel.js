//Filename: Webservice.js

define([
	'jquery',
	'underscore',
	'logging',
	'BaseModel',
	'RelationalModel',
	'models/workflow/ParameterModel',
	'constants/RDFNS'
], function($,
	_,
	logging,
	BaseModel,
	RelationalModel,
	ParameterModel,
	NS) {

	var log = logging.getLogger("Webservice.js");

	var theDefaults = {};
	NS.rdf_attr("rdf:type", theDefaults, NS.expand("omnom:Webservice"));
	// theDefaults["rdf:type"] = NS.expand("omnom:Webservice");
	// theDefaults[NS.expand("omnom:inputParam")] = [];
	// theDefaults[NS.OMNOM().PROP_OUTPUT_PARAM()] = [];
	// // console.log(theDefaults);

	return RelationalModel.extend({

		defaults : theDefaults,

		// toJSON : function() {
		//     var asJSON = _.clone(this.attributes);
		//     asJSON.uuid = this.cid;
		//     return asJSON;
		// },
		relations : [ {
			type : Backbone.HasMany,
			key : NS.expand("omnom:inputParam"),
			relatedModel : ParameterModel,
		},
		{
			type : Backbone.HasMany,
			key : NS.expand("omnom:outputParam"),
			relatedModel : ParameterModel,
		} ],

        // parse: function(data) {
            // if (_.isString(data)) {
                // return { id : data };
            // }
            // return data;
        // }

	// initialize: function() {
	// console.log(RDFNS.OMNOM);
	// }
	});
});
