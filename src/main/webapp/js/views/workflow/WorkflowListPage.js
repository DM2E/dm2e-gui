//Filename: js/views/workflow/WorkflowListPage.js

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
    'views/workflow/WorkflowTableRow',
    'views/filter/QueryFilterView',
], function($,
	_,
	BaseView,
	logging,
	Vm,
	session,
	RDFNS,
	sorttable,
//	WorkflowCollection,
//	WorkflowModel,
	workflowListTemplate,
    WorkflowTableRow,
    QueryFilterView
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
        fetchCollection : function() {
            var that = this;
            // console.log(this.collection.url());
            that.collection.fetch({
                dataType : "json",
                processData : true,
                reset : true,   // important to make sort work
                data : this.queryParams,
                success : function(collection) {
                    log.debug("WorkflowCollection retrieved, size: " + collection.models.length);
                    // that.render();
                },
                error: function(collection, resp) {
                    log.warn("Error retrieving collection");
                    console.error(resp);
                },
            });
        },
        // renderFilterBar: function() {

        //     var that = this;
        //     var filterbar = new FilterView({
        //         collection: this.collection,
        //         el: this.$(".filter-bar"),
        //     });
        //     filterbar.template = workflowFilterTemplate;
        //     filterbar.tableToFilter = this.$("table");
        //     filterbar.render();

        //     session.user.on("sync", this.renderFilterBar, this);

        //     var globalUserFilter = {};
        //     if (session.user.getQN("omnom:globalUserFilter") === 'true') {
        //       globalUserFilter[RDFNS.expand("dcterms:creator")] = session.user.id;
        //     }
        //     filterbar.applyFilters(globalUserFilter);
        // },

		initialize : function(options) {
            if (!options) { options = {}; }
            this.queryParams = options.queryParams ? options.queryParams : {};
            if (! this.queryParams.start) { this.queryParams.start = 0; }
            if (! this.queryParams.limit) { this.queryParams.limit = 200; }
            if (! this.queryParams.sort) { this.queryParams.sort = RDFNS.expand("dcterms:created"); }
            if (! this.queryParams.order) { this.queryParams.order = 'desc'; }
            if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                this.queryParams.user = session.user.id;
                this.fetchCollection();
            }
            this.listenTo(session.user, "change", function() {
                if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                    this.queryParams.user = session.user.id;
                } else {
                    delete this.queryParams.user;
                }
                this.fetchCollection();
            }, this);
			
//			this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "sync", this.render);
            this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
            // this.collection.on('sync', this.renderFilterBar, this);
            this.fetchCollection();

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
            var filterView = new QueryFilterView({
                $el : this.$(".filter-bar"),
                parentView: this,
                showOrHide: 'hide',
                facets: [
                    {'queryParam': 'user',
                     'label': 'Creator',
                     'rdfProp' : RDFNS.expand('dcterms:creator')},
                ],
                sortOpts: {
                    'created' : RDFNS.expand('dcterms:created'),
                    'creator' : RDFNS.expand('dcterms:creator'),
                },
            });
            filterView.render();
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
