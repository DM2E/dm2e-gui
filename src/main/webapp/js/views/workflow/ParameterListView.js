//Filename: ParameterListView.js 

define([
        'jquery',
        'underscore',
        'logging',
        'BaseView',
        'vm',
        'uuid',
        'util/dialogs',
        'constants/RDFNS',
        'text!templates/workflow/parameterListTemplate.html',
        'views/workflow/ParameterListItemView',
        'models/workflow/ConnectorModel',
], function($,
    _,
    logging,
    BaseView,
    Vm,
    UUID,
    dialogs,
    NS,
    parameterListTemplate,
    ParameterListItemView,
    ConnectorModel) {

    var log = logging.getLogger("views.workflow.ParameterListView");

    return BaseView.extend({

        events: {
            "click button.add-parameter": function() {
                this.addItem({});
            }
        },

        addItem: function(preset, successCallback) {
            //          console.log("param coll: %o", this.collection);
            var NewModel = this.collection.model;
            //          console.log("new model: %o", NewModel);
            var newInst = new NewModel(preset);
            //          console.log("new instance: %o", newInst);
            //          this.collection.add(newInst);
            var modalView = new ParameterListItemView({
                model: newInst,
                workflowOrPosition: 'workflow',
            });
            var that = this;
            modalView.on("parameter-was-saved", function() {
                that.collection.add(newInst);
                if (successCallback) {
                    successCallback();
                }
            });
            modalView.showForm();
            return newInst;
        },

        initialize: function(options) {
            log.debug("Initialized ParameterListView.js");

            this.listClass = options.listClass;
            this.itemClass = options.itemClass;
            this.parentModel = options.parentModel;
            this.inputOrOutput = options.inputOrOutput;


            this.$el.addClass(this.listClass);

            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.render);
        },

        render: function() {
            this.$el.html(parameterListTemplate);

            var parameterList = this;
            var workflow = this.parentModel;
            this.$(".add-parameter-dropzone").droppable({
                accept: function(draggable) {
                    log.debug("Workflow: " + workflow.id);
                    if (!draggable.hasClass("parameter"))
                        return false;
                    var source = draggable.data("model");
                    var sourceParent = draggable.data("parentModel");
                    if (source.inputOrOutput !== parameterList.inputOrOutput)
                        return false;
                    if (sourceParent === workflow)
                        return false;
                    return true;
                },
                drop: function(event, ui) {
                    var source = ui.draggable.data("model");
                    var sourceParent = ui.draggable.data("parentModel");
                    console.log(source);
                    var sourceModelJSON = source.toJSON();
                    // FIXME
                    // delete the ID so backbone-relational is happy and we're forced to create a new, workflow-specific one
                    delete sourceModelJSON.id;
                    sourceModelJSON.id = workflow.id + '/param/' + UUID.v4();

                    // Add parameter
                    var newParam  = parameterList.addItem(sourceModelJSON,function(){
                        // Create a connection
                        var conn = {};

                        // sanity check
                        if (typeof parameterList.inputOrOutput === 'undefined') {
                            console.error(parameterList);
                            throw "ParameterList is neither input NOR output!";
                        }
                        if (parameterList.inputOrOutput === 'input') {
                            NS.rdf_attr("omnom:fromParam", conn, newParam);
                            NS.rdf_attr("omnom:toParam", conn, source);
                            NS.rdf_attr("omnom:fromWorkflow", conn, workflow);
                            NS.rdf_attr("omnom:toPosition", conn, sourceParent);
                        } else {
                            NS.rdf_attr("omnom:fromParam", conn, source);
                            NS.rdf_attr("omnom:toParam", conn, newParam);
                            NS.rdf_attr("omnom:fromPosition", conn, sourceParent);
                            NS.rdf_attr("omnom:toWorkflow", conn, workflow);
                        }
                        workflow.getQN("omnom:parameterConnector").add(conn);
                    });

                },
                activeClass: "drop-active",
                hoverClass: "drop-hover",
            });
            Vm.cleanupSubViews(this);
            _.each(this.collection.models, function(parameterModel) {
                var subview = Vm.createSubView(this, ParameterListItemView, {
                    model: parameterModel,
                    itemClass: this.itemClass,
                    parentModel: this.parentModel,
                    inputOrOutput: this.inputOrOutput,
                });
                this.appendHTML(subview, "div.list-container");
            }, this);
        }

    });
});
