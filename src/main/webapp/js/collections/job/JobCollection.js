define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'models/job/JobModel'
], function(_, Backbone, logging, FILESTATUS, JobModel) {

	var log = logging.getLogger("collections.job.JobCollection");
	return Backbone.Collection.extend({

        model : JobModel,

        url : 'api/job/list',

    });

});
