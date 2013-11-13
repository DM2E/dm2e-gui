//Filename: WorkflowModel.js

define(['jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'RelationalModel', // lib/backbone/backbone
    'logging', // logging
    'constants/RDFNS',
        'models/workflow/PositionModel',
        'models/workflow/ParameterModel',
        'models/workflow/ConnectorModel',
        'models/workflow/WebserviceModel',
        'collections/workflow/PositionCollection',
        'collections/workflow/ParameterCollection',
        'collections/workflow/ConnectorCollection',
        'collections/workflow/WebserviceCollection',
], function($,
    _,
    RelationalModel,
    logging,
    NS,
    PositionModel,
    ParameterModel,
    ConnectorModel,
    WebserviceModel,
    PositionCollection,
    ParameterCollection,
    ConnectorCollection,
    WebserviceCollection
           ) {

    var log = logging.getLogger("WorkflowModel.js");

    var theDefaults = {};

    console.log(NS.OMNOM());

    var model = RelationalModel.extend({

        //      urlRoot : 'api/workflow',

        relations: [{
                type: Backbone.HasMany,
                key: NS.OMNOM().PROP_WORKFLOW_POSITION(),
                relatedModel: PositionModel,
                collectionType: PositionCollection,
                //              reverseRelation : {
                //                  key : NS.expand("omnom:inWorkflow"),
                //                  includeInJSON : true
                //              }
            }, {
                type: Backbone.HasMany,
                key: NS.expand("omnom:outputParam"),
                relatedModel: ParameterModel,
                collectionType: ParameterCollection,
                //              reverseRelation : {
                //                  key : NS.expand("omnom:inWorkflow"),
                ////                    keySource : NS.expand("omnom:inWorkflow"),
                ////                    keyDestination : NS.expand("omnom:outputParam"),
                //                  includeInJSON : true
                //              }
            }, {
                type: Backbone.HasMany,
                key: NS.expand("omnom:inputParam"),
                relatedModel: ParameterModel,
                collectionType: ParameterCollection,
                //                reverseRelation : {
                //                    key : NS.expand("omnom:inWorkflow"),
                //                    includeInJSON : true
                //                }
            }, {
                type: Backbone.HasMany,
                key: NS.expand("omnom:parameterConnector"),
                relatedModel: ConnectorModel,
                collectionType: ConnectorCollection,
                //                includeInJSON: ["id"],
                //              reverseRelation : {
                //                  key : NS.expand("omnom:inWorkflow"),
                //                  includeInJSON : true
                //              }
            },
            {
                type: Backbone.HasMany,
                key: NS.expand("omnom:isExecutableAt"),
                relatedModel: WebserviceModel,
                collectionType: WebserviceCollection,
            },
        ],

        /**
         * Removes unconnected connectors.
         *
         * @function
         */
        cleanupConnectors: function() {
            console.log("yay");
            console.log(this.getQN("omnom:parameterConnector"));
            var workflow = this;
            var i = 0;
            var modelsCopy = _.clone(workflow.getQN("omnom:parameterConnector").models);
            _.each(modelsCopy, function(conn) {

                /*
                 * Check to/from workflow params for existance
                 */
                console.log(i++);
                console.log(conn);


                // if connector has fromWorkflow but the param referenced isn't part of the workflow
                if (conn.getQN("omnom:fromWorkflow") && 
                    ! workflow.getQN("omnom:inputParam").contains(conn.getQN("omnom:fromParam"))) {
                    return workflow.getQN("omnom:parameterConnector").remove(conn);
                }
                // if connector has toWorkflow but the param referenced isn't part of the workflow
                if (conn.getQN("omnom:toWorkflow") && 
                    ! workflow.getQN("omnom:outputParam").contains(conn.getQN("omnom:toParam"))) {
                    return workflow.getQN("omnom:parameterConnector").remove(conn);
                }

                /*
                 * Check to/from position for existance
                 */
                // if the connector has fromPosition x but x is not part of the workflow
                if (conn.getQN("omnom:fromPosition") && !workflow.getQN("omnom:workflowPosition").find({
                    "id": conn.getQN("omnom:fromPosition").id
                })) {
                    log.debug("Removing connector because omnom:fromPosition doesn't exist");
                    return workflow.getQN("omnom:parameterConnector").remove(conn);
                }
                // if the connector has toPosition x but x is not part of the workflow
                if (conn.getQN("omnom:toPosition") && !workflow.getQN("omnom:workflowPosition").find({
                    "id": conn.getQN("omnom:toPosition").id
                })) {
                    log.debug("Removing connector because omnom:toPosition doesn't exist");
                    return workflow.getQN("omnom:parameterConnector").remove(conn);
                }

                /*
                 * TODO Maybe check that the position referenced from a connector actually
                 * has the parameters in the connector. This should be handled by the previous
                 * clauses but could become a problem if positions are renamed...
                 */
            });
        },

        dumpToJSON: function() {

            var asJSON = this.toJSON();
            //
            var replacer = function(k, v) {
                return v;
            };
            console.log(asJSON);
            return JSON.stringify(asJSON, replacer, 2);
        }

    });
    model.setup();
    return model;
});
