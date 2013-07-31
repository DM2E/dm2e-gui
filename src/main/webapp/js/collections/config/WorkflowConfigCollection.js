define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'models/config/WorkflowConfigModel'
], function(_, Backbone, logging, FILESTATUS, ConfigModel) {

	var log = logging.getLogger("collections.config.WorkflowConfigCollection");
	return Backbone.Collection.extend({

        model : ConfigModel,

        url : 'api/config/list',

    });

});
