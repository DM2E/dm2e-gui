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
        'views/FilterView',
        'text!templates/config/configFilterTemplate.html',
        'collections/config/WorkflowConfigCollection'
], function($,
         _,
         logging,
         Vm,
         BaseView,
         NS,
         dialogs,
         sorttable,
         session,
         ConfigListTableRowView,
         theTemplate,
         FilterView,
         configFilterTemplate,
         WorkflowConfigCollection
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

        renderFilterBar: function() {
            var that = this;
            var filterbar = new FilterView({
                collection: this.collection,
                el: this.$(".filter-bar"),
            });
            filterbar.template = configFilterTemplate;
            filterbar.tableToFilter = this.$("table");
            filterbar.render();

            session.user.on("sync", this.renderFilterBar, this);

            var globalUserFilter = {};
            if (session.user.getQN("omnom:globalUserFilter")) {
              globalUserFilter[NS.expand("dcterms:creator")] = session.user.id;
            }
            filterbar.applyFilters(globalUserFilter);
        },

        initialize : function() {
            this.listenTo(this.collection, "sync", this.render);
            this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
            this.listenTo(this.collection, "sync", this.renderFilterBar);
            this.collection.fetch();
        },

        render : function() {
            // _.each(this.collection.models, function(config) {
            //     _.each(config.getQN("omnom:assignment").models, function(ass) {
            //         if (config.get("workflow")) { return; }
            //         console.log(ass);
            //         var forParamId = ass.getQN("omnom:forParam").id;
            //         if(/\/workflow$/.test(forParamId)) {
            //             config.set("workflow", ass.getQN("omnom:parameterValue"));
            //         }
            //     });
            // });


            // this.collection = new WorkflowConfigCollection( this.collection.models
                // // _.filter(this.collection.models, function(model) { return model.get("workflow") !== null; }));
                // // _.filter(this.collection.models, function(model) { return true; }));
            // );
            // var collectionArray = this.collection.filter(function(model) { return model.get("workflow"); });
            this.renderModel();
            // this.renderCollection({}, this.listSelector, this.itemView, collectionArray);
            this.renderCollection();
            sorttable.makeSortable(this.$("table")[0]);
            return this;
        },

    });
});
