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
       'views/job/JobListTableRowView',
       'text!templates/job/jobListPageTemplate.html',
       'views/FilterView',
       'text!templates/job/jobFilterTemplate.html'
], function($,
            _,
            logging,
            Vm,
            BaseView,
            NS,
            dialogs,
            sorttable,
            session,
            ItemView,
            theTemplate,
            FilterView,
            jobFilterTemplate) {

    var log = logging.getLogger("views.job.JobListPage");

    return BaseView.extend({

        template: theTemplate,

        itemView: ItemView,

        listSelector : "tbody",

        hideLoadingIndicator : function() {
          if (this.collection.models.length === 0) {
            this.$el.append("No Jobs found.");
          }
          this.$(".loading-indicator").hide();
        },

        renderFilterBar: function() {
            var that = this;
            var filterbar = new FilterView({
                collection: this.collection,
                el: this.$(".filter-bar"),
            });
            filterbar.template = jobFilterTemplate;
            filterbar.tableToFilter = this.$("table");
            filterbar.render();
        },

        initialize : function() {
            this.listenTo(this.collection, "sync", this.render);
            this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
            this.listenTo(this.collection, "sync", this.renderFilterBar);
            this.collection.fetch();
        },

        render : function() {
            this.renderModel();
            this.renderCollection();
            sorttable.makeSortable(this.$("table")[0]);
            return this;
        },

    });
});
