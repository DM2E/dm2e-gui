//Filename: WorkflowConfigModel.js
define([
    'jquery',
    'underscore',
    'logging',
    'constants/RDFNS',
    'RelationalModel',
    'models/config/ParameterAssignmentModel',
], function($,
    _,
    logging,
    NS,
    RelationalModel,
    ParameterAssignmentModel
   ) {

    var moduleName="WorkflowConfigModel";
    var log = logging.getLogger("models.config.WorkflowConfigModel");

    var theDefaults = {};
    theDefaults[NS.expand("rdf:type")] = NS.expand("omnom:WorkflowConfig");

    return RelationalModel.extend({

        defaults : theDefaults,

        relations : [
            {
                type : Backbone.HasMany,
                key : NS.expand("omnom:assignment"),
                relatedModel : ParameterAssignmentModel
//                collectionType: PositionCollection,

            }
        ],

        initialize : function () {
            log.debug("Initialized " + moduleName + ".");
        }

    });
});
