//Filename: JobModel

define([
    'jquery',
    'underscore',
    'logging',
    'constants/RDFNS',
    'BaseModel',
//    'RelationalModel',
],
/**
 * A model representing a Job.
 * @module models/job/JobModel
 */

function($,
    _,
    logging,
    NS,
    BaseModel
    ) {

    var log = logging.getLogger("models.job.JobModel");

    var theDefaults = {};

    /** 
      @constructor
      @requires Underscore
      @requires Backbone
      @augments module:Backbone.Model
      */
    return BaseModel.extend({
      /** 
        @#lends module:models/job/JobModel~JobModel.prototype
        */

        defaults : theDefaults,

        initialize : function () {
            log.debug("Initialized JobModel");
        }

    });
});
