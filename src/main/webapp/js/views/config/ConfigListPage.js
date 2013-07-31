//Filename: filename

define([
        'jquery',
        'underscore',
        'logging',
        'vm',
        'BaseView',
        'constants/RDFNS',
        'util/dialogs',
        'singletons/UserSession',
        'views/config/ConfigListTableRowView',
        'text!templates/config/ConfigListTemplate.html'
], function($, _, logging, Vm, BaseView, NS, dialogs, session, ConfigListTableRowView, theTemplate) {

    var log = logging.getLogger("views.config.ConfigListPage");

    return BaseView.extend({

        template: theTemplate,

        itemView: ConfigListTableRowView,

        listSelector : "tbody",

        initialize : function() {
            this.listenTo(this.collection, "sync", this.render);
            console.error("FNAQR");
            this.collection.fetch();
        },

        render : function() {
            this.renderModel();
            this.renderCollection();
            return this;
        },

    });
});
