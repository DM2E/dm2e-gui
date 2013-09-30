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
        'text!templates/config/ConfigListTemplate.html'
], function($, _, logging, Vm, BaseView, NS, dialogs, sorttable, session, ConfigListTableRowView, theTemplate) {

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

        initialize : function() {
            this.listenTo(this.collection, "sync", this.render);
            this.listenTo(this.collection, "sync", this.hideLoadingIndicator);
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
