define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'constants/RDFNS',
	'models/job/AssignmentModel'
], function(_, Backbone, logging, FILESTATUS, RDFNS, AssignmentModel) {

	var log = logging.getLogger("collections.job.AssignmentCollection");
	return Backbone.Collection.extend({

        model : AssignmentModel,

        comparator : RDFNS.expand('rdfs:label'),

        // url : 'api/job/list',

    });

});
