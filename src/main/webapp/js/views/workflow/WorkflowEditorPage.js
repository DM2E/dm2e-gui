//Filename: WorkflowView.js

define([
        'jquery',
        'underscore',
        'BaseView',
        'logging',
        'vm',
        'singletons/UserSession',
        'constants/RDFNS',
        'util/dialogs',
        'collections/workflow/WebserviceCollection',
        'models/workflow/WorkflowModel',
        'models/workflow/WebserviceModel',
        'views/workflow/WebserviceListView',
        'views/workflow/ParameterListView',
        'views/workflow/PositionListView',
        'views/workflow/ConnectorListView',
        'text!templates/workflow/workflowEditorTemplate.html'
], function($,
    _,
    BaseView,
    logging,
    Vm,
    session,
    NS,
    dialogs,
    WebserviceCollection,
    WorkflowModel,
    WebserviceModel,
    WebserviceListView,
    ParameterListView,
    PositionListView,
    ConnectorListView,
    workflowEditorTemplate) {

    var log = logging.getLogger("views.workflow.WorkflowView");

    return BaseView.extend({

        template: workflowEditorTemplate,

        events: {
            "click button#save-workflow": function() {
                this.saveWorkflow();
            },
            "click button#create-config": function() {
                this.createConfig();
            },
            "click button#render": function() {
                this.render();
            },
            "click button#visualize": function() {
                this.saveWorkflow();
                var visualizationImage = $('<img />').attr('src', this.model.id + "/png");
                var winHeight = 300;
                var winWidth = 960;
                window.open(visualizationImage.attr('src'),
                            "_blank",
                            'height=' + winHeight + ', width=' + winWidth + ', toolbar=0, location=0, status=0, scrollbars=0, resizable=0');
            },
        },

        initialize: function() {

            /* Re-render on changes and when synced */
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.model, "sync", this.render);

            /* Auto-Save on add/remove of any component */
            // this.listenTo(this.model.getQN("omnom:outputParam"), "add", this.saveWorkflow);
            // this.listenTo(this.model.getQN("omnom:outputParam"), "remove", this.saveWorkflow);
            // this.listenTo(this.model.getQN("omnom:inputParam"), "add", this.saveWorkflow);
            // this.listenTo(this.model.getQN("omnom:inputParam"), "remove", this.saveWorkflow);
            // this.listenTo(this.model.getQN("omnom:parameterConnector"), "add", this.saveWorkflow);
            // this.listenTo(this.model.getQN("omnom:parameterConnector"), "remove", this.saveWorkflow);
            this.listenTo(this.model.getQN("omnom:workflowPosition"), "add", this.saveWorkflow);
            this.listenTo(this.model.getQN("omnom:workflowPosition"), "remove", this.saveWorkflow);

            this.listenTo(this.model.getQN("omnom:outputParam"), "remove", function() {
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
              console.error("I NOTICED YOU STEALING MY PARAMZ!");
            });
            // NOTE cannot reference $el yet because app.js assigns it to the #page at render time => render
            //            this.$el.attr("data-backbone-modelid", this.model.id);

            /*
             * Load Webservice List
             */
            this.webserviceCollection = new WebserviceCollection(NS.rdf_attr("omnom:webservice", session));
            console.log(this.webserviceCollection);
            this.webserviceListView = Vm.createView(this, 'WebserviceListView', WebserviceListView, {
                collection: this.webserviceCollection
            });
            //          console.log(session.user.getQN("omnom:webservice").models);

            /*
             * Parameter Views
             */
            this.inputParameterListView = Vm.createView(this,
                'InputParameterListView',
                ParameterListView, {
                parentType: NS.expand("omnom:Workflow"),
                parentModel: this.model,
                inputOrOutput: 'input',
                itemClass: "input-param",
                collection: this.model.getQN("omnom:inputParam")
            });
            this.outputParameterListView = Vm.createView(this,
                'OutputParameterListView',
                ParameterListView, {
                parentType: NS.expand("omnom:Workflow"),
                parentModel: this.model,
                inputOrOutput: 'output',
                itemClass: "output-param",
                collection: this.model.getQN("omnom:outputParam")
            });

            /*
             * Positions View
             */
            this.positionListView = Vm.createView(this, 'PositionListView', PositionListView, {
                collection: this.model.getQN("omnom:workflowPosition")
            });

            /*
             * Connectors View
             */
            this.connectorListView = Vm.createView(this, 'ConnectorListView', ConnectorListView, {
                collection: this.model.getQN("omnom:parameterConnector")
            });

        },

        renderInputParameterListView: function() {
            this.assign(this.inputParameterListView, "#workflow-input-parameter-list");
            this.$("#workflow-input-parameter-list").attr("data-backbone-modelid", this.model.id);
        },
        renderOutputParameterListView: function() {
            this.assign(this.outputParameterListView, "#workflow-output-parameter-list");
            this.$("#workflow-output-parameter-list").attr("data-backbone-modelid", this.model.id);
        },

        renderPositionListView: function() {
            this.assign(this.positionListView, "#workflow-position-list");
        },

        renderConnectorListView: function() {
            this.assign(this.connectorListView, "#workflow-connector-list");
        },

        renderWebserviceList: function() {
            log.info("renderWebserviceList()");
            this.assign(this.webserviceListView, '#workflow-webservice-list');
        },

        render: function() {
            this.$el.data("model", this.model);
            this.renderModel();
            this.renderWebserviceList();
            this.renderInputParameterListView();
            this.renderOutputParameterListView();
            this.renderPositionListView();
            this.renderConnectorListView();
            return this;
        },

        saveWorkflow: function() {
            log.debug(JSON.stringify(this.model.toJSON(), undefined, 2));
            console.debug(this.model.toJSON());
            this.setButtonLoading("button#save-workflow");
            var that = this;

            this.model.setQN("rdfs:label", $("#workflow-label").val());

            this.model.setQN("dcterms:creator", {
                "id": session.user.id
            });
            this.model.setQN("dcterms:modified", new Date().toISOString());
            // Un-Skolemize positions (i.e. make them blank nodes and let the
            // server rename them again
            // FIXME this does not work because connectors do not pick up the change and become invalid.
            // Have to do this by hand in JS
            //            console.warn(this.model);
            //            _.each(this.model.getQN("omnom:workflowPosition").models, function(pos) {
            //                delete pos.attributes.id;
            //                pos.id = null;
            //                pos.set("id", undefined);
            //                console.warn(pos);
            //            });
            this.model.save().then(function(data, textStatus, xhr) {
                that.unsetButtonLoading("button#save-workflow");
                if (xhr.status >= 200 && xhr.status < 300) {
                    dialogs.notify("Saved Workflow " + that.model.id, 'success');
                    //                        that.odel.fetch().then(that.render);
                } else {
                    dialogs.notify(xhr.statusText, 'error');
                }
            });
        },

        createConfig: function() {
            this.saveWorkflow();
            // Navigate to the config editor
            window.location.hash = "#config-edit-from/" + this.model.id;
        }

    });
});
