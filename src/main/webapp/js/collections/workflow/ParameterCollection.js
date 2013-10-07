//Filename: ParameterCollection.js

define([
	'jquery',
	'underscore',
	'logging',
	'BaseCollection',
	'constants/RDFNS',
	'models/workflow/ParameterModel'
], function($,
	_,
	logging,
	BaseCollection,
	RDFNS,
	ParameterModel) {

	var log = logging.getLogger("ParameterCollection.js");

	return BaseCollection.extend({

		model : ParameterModel,

		comparator : RDFNS.expand('rdfs:label')

	});
});
