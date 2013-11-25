//Filename: filename

define([
        'jquery',
        'underscore',
        'logging',
        'vm',
        'BaseView',
        'constants/RDFNS',
        'util/dialogs',
        'sorttable',
        'singletons/UserSession',
        'views/config/ConfigListTableRowView',
        'text!templates/config/ConfigListTemplate.html',
        'views/filter/QueryFilterView',
], function($,
         _,
         logging,
         Vm,
         BaseView,
         RDFNS,
         dialogs,
         sorttable,
         session,
         ConfigListTableRowView,
         theTemplate,
         QueryFilterView
           ) {

    var log = logging.getLogger("views.config.ConfigListPage");

    return BaseView.extend({

        template: theTemplate,

        itemView: ConfigListTableRowView,

        listSelector : "tbody",
        
		hideLoadingIndicator : function() {
			if (this.collection.models.length === 0) {
				this.$el.append("No Configurations found.");
			}
			this.$(".loading-indicator").hide();
		},

        initialize : function(options) {
            this.queryParams = options.queryParams ? options.queryParams : {};
            if (! this.queryParams.start) { this.queryParams.start = 0; }
            if (! this.queryParams.limit) { this.queryParams.limit = 200; }
            if (! this.queryParams.sort) { this.queryParams.sort = RDFNS.expand("dcterms:modified"); }
            if (! this.queryParams.order) { this.queryParams.order = 'desc'; }
            if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                this.queryParams.user = session.user.id;
            }
            this.listenTo(session.user, "sync", function() {
                dialogs.notify('Refreshing config list', 'info');
                if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                    this.queryParams.user = session.user.id;
                } else {
                    delete this.queryParams.user;
                }
                this.fetchCollection();
            }, this);
            this.listenTo(this.collection, "sync", this.render);
            this.fetchCollection();
        },

        fetchCollection : function() {
            this.collection.fetch({
                dataType : "json",
                processData : true,
                reset : true,   // important to make sort work
                data : this.queryParams,
                success : function(collection) {
                    log.debug("FilesCollection retrieved, size: " + collection.models.length);
                },
                error: function(collection, resp) {
                    log.warn("Error retrieving collection");
                    console.error(resp);
                },
            });
        },

        render : function() {
            this.renderModel();
            this.renderCollection();
            // sorttable.makeSortable(this.$("table")[0]);
            var filterView = new QueryFilterView({
                $el : this.$(".filter-bar"),
                parentView: this,
                showOrHide: 'show',
                facets: [
                    {'queryParam': 'user',
                     'label': 'Creator',
                     'rdfProp' : RDFNS.expand('dcterms:creator')},
                ],
                sortOpts: {
                    'user' : RDFNS.expand('omnom:fileOwner'),
                    'modified' : RDFNS.expand('dcterms:modified'),
                },
            });
            filterView.render();
            this.hideLoadingIndicator();
            // this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
            return this;
        },

    });
});
