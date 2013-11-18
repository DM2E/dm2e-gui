//Filename: JobModel

define([
    'jquery',
    'underscore',
    'logging',
    'constants/RDFNS',
    'BaseModel',
    'models/job/JobModel',
    'RelationalModel',
],
/**
 * A model representing a Job.
 * @module models/job/JobModel
 */

function($,
    _,
    logging,
    NS,
    BaseModel,
    JobModel,
    RelationalModel
    ) {

    var log = logging.getLogger("models.job.JobModel");

    var theDefaults = {};

    /** 
      @constructor
      @requires Underscore
      @requires Backbone
      @augments module:Backbone.Model
      */
    return RelationalModel.extend({
      /** 
        @#lends module:models/job/JobModel~JobModel.prototype
        */

        defaults : theDefaults,

        initialize : function () {
            log.debug("Initialized JobModel");
        },
		relations: [
            {
				type : Backbone.HasMany,
				key : NS.expand("omnom:finishedJobs"),
				relatedModel : JobModel,
                // includeInJSON : ["id", "uuid"],
			},
        ],

    });
});
