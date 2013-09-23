//Filename: WorkflowView.js

define([
	'jquery', // lib/jquery/jquery
	'underscore', // lib/underscore/underscore
	'BaseView', // lib/backbone/backbone
	'logging', // logging
	'vm',
	'singletons/UserSession',
	'constants/RDFNS',
	'sorttable',
//	'collections/workflow/WorkflowCollection',
//	'models/workflow/WorkflowModel',
	'text!templates/workflow/workflowListPage.html',
    'views/workflow/WorkflowTableRow'
], function($,
	_,
	BaseView,
	logging,
	Vm,
	session,
	NS,
	sorttable,
//	WorkflowCollection,
//	WorkflowModel,
	workflowListTemplate,
    WorkflowTableRow
	) {

	var log = logging.getLogger("views.workflow.WorkflowListPage");

	return BaseView.extend({

        template : workflowListTemplate,

        itemView: WorkflowTableRow,

        events : {
		},

        hideLoadingIndicator : function() {
            this.$(".loading-indicator").hide();
            if (this.collection.models.length === 0) {
                this.$el.append("No workflows found");
            }
        },

		initialize : function() {
			
//			this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "sync", this.render);
            this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
            this.collection.fetch();

//			/*
//			 * Load Webservice List
//			 */
//			this.webserviceCollection = session.get("user").getQN("omnom:webservice");
//			this.webserviceListView = Vm.createView(this, 'WebserviceListView', WebserviceListView, {
//				collection : this.webserviceCollection
//			});

		},

		render : function () {
            this.renderModel();
            console.log(this.collection);
            this.renderCollection({}, 'tbody');
            sorttable.makeSortable(this.$("table")[0]);
            sorttable.innerSortFunction.apply(this.$("th", $("table")[0])[6]);
            return this;
		},
		
//		saveWorkflow: function() {
//			log.debug(JSON.stringify(this.model.toJSON(), undefined, 2));
//			log.debug(this.model.toJSON());
//			this.model.save();
//		},

	});
});
