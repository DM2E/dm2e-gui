//Filename: ConnectorModel.js

define([
        'RelationalModel', // lib/backbone/backbone
        'logging', // logging
        'models/workflow/WorkflowModel',
        'models/workflow/WebserviceModel',
        'models/workflow/ParameterModel',
        'constants/RDFNS',
    ],
function (
      RelationalModel,
      logging,
      WorkflowModel,
      PositionModel,
      ParameterModel,
      NS) {

          console.log(WorkflowModel);

    var log = logging.getLogger("models.workflow.ConnectorModel");

    var theDefaults = {};
    theDefaults[NS.expand("rdf:type")] = NS.expand("omnom:ParameterConnector");

    var rdfRange = {
        "omnom:fromPosition" : "omnom:WorkflowPosition",
        "omnom:toPosition" : "omnom:WorkflowPosition",
        "omnom:fromWorkflow" : "omnom:Workflow",
        "omnom:toWorkflow" : "omnom:Workflow",
        "omnom:toParam" : "omnom:Parameter",
        "omnom:fromParam" : "omnom:Parameter",
    };

    // TODO fix the circular reference: Workflow-Connector-Workflow
    var model = RelationalModel.extend({

        defaults: theDefaults,

        toJSON : function() {
//            console.warn(this.getQN("omnom:fromWorkflow"));
            var retJSON = {
                id : this.id,
                uuid : this.cid,
            };
            _.each([
                "omnom:fromWorkflow",
                "omnom:fromPosition",
                "omnom:fromParam",
                "omnom:toWorkflow",
                "omnom:toPosition",
                "omnom:toParam",
            ], function (qname) {
                if (!this.getQN(qname)) {
                    return;
                }
//                console.error(this.getQN(qname));
                retJSON[NS.expand(qname)] = {};
                retJSON[NS.expand(qname)][NS.expand("rdf:type")] = NS.expand(rdfRange[qname]);
                retJSON[NS.expand(qname)].id =  this.getQN(qname).id;

                // THIS IS THE HACK THAT MAKES IT AAAALL WORK
                if (this.getQN(qname).attributes) {
                    retJSON[NS.expand(qname)].uuid =  this.getQN(qname).attributes.cid;
                }
            }, this);
            return retJSON;
        },

        relations: [
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:fromWorkflow"),
                relatedModel: WorkflowModel,
                isAutoRelation: true,
                includeInJSON: [ "id", "uuid" ],
            },
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:toWorkflow"),
                relatedModel: WorkflowModel,
                isAutoRelation: true,
                includeInJSON: [ "id", "uuid" ],
            },
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:fromPosition"),
                relatedModel: PositionModel,
                includeInJSON: [ "id", "uuid" ],
            },
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:toPosition"),
                relatedModel: PositionModel,
                includeInJSON: [ "id", "uuid" ],
            },
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:fromParam"),
                relatedModel: ParameterModel,
                includeInJSON: [ "id", "uuid" ],
            },
            {
                type: Backbone.HasOne,
                key: NS.expand("omnom:toParam"),
                relatedModel: ParameterModel,
                includeInJSON: [ "id", "uuid" ],
            }
        ]
    });
    model.setup();
    return model;
});
