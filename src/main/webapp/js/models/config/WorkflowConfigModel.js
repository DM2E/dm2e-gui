//Filename: WorkflowConfigModel.js
define([
    'jquery',
    'underscore',
    'logging',
    'constants/RDFNS',
    'RelationalModel',
    'models/config/ParameterAssignmentModel',
    'collections/job/AssignmentCollection',
], function($,
    _,
    logging,
    NS,
    RelationalModel,
    ParameterAssignmentModel,
    AssignmentCollection
   ) {

    var moduleName="WorkflowConfigModel";
    var log = logging.getLogger("models.config.WorkflowConfigModel");

    var theDefaults = {};
    theDefaults[NS.expand("rdf:type")] = NS.expand("omnom:WebserviceConfig");

    return RelationalModel.extend({

        defaults : theDefaults,

        relations : [
            {
                type : Backbone.HasMany,
                key : NS.expand("omnom:assignment"),
                relatedModel : ParameterAssignmentModel,
                collectionType: AssignmentCollection,

            }
        ],

        initialize : function () {
            log.debug("Initialized " + moduleName + ".");
        }

    });
});
