define([
	'underscore',
	'backbone',
	'logging',
	'constants/FILESTATUS',
	'constants/RDFNS',
	'models/file/FileModel',
], function(_, Backbone, logging, FILESTATUS, RDFNS, FileModel) {

	'use strict';

	var log = logging.getLogger("FilesCollection");
	return Backbone.Collection.extend({

		model: FileModel,

		comparator : RDFNS.expand('rdfs:label'),

		initialize: function(models, options) {
			options = options || {};
			// log.debug("Created FilesCollection of " + models.length + "
			// files.");
			if (options.url) {
				this.url = function() {
					return options.url;
				};
			}
		},

		// url : function() {
		// return 'api/file/list';
		// },

		parse: function(data) {
			log.debug("Parsing list of files.");
			// console.log(data);
			return data;
		},

		listAvailable: function() {
			//			return this.where({fileStatus : FILESTATUS.AVAILABLE});
			return this.models;
		}

	});

});
