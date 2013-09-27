define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'models/job/AssignmentModel'
], function(_, Backbone, logging, FILESTATUS, AssignmentModel) {

	var log = logging.getLogger("collections.job.AssignmentCollection");
	return Backbone.Collection.extend({

        model : AssignmentModel,

        // url : 'api/job/list',

    });

});
