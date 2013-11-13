define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'constants/RDFNS',
	'models/config/WorkflowConfigModel'
], function(_, Backbone, logging, FILESTATUS, RDFNS, ConfigModel) {

	var log = logging.getLogger("collections.config.WorkflowConfigCollection");
	return Backbone.Collection.extend({

        model : ConfigModel,

        url : 'api/config/list',

        comparator : RDFNS.expand('dcterms:created'),

    });

});
