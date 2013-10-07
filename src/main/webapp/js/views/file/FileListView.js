define([
    'jquery',
    'underscore',
    'BaseView',
    'logging',
    'vm',
	'singletons/UserSession',
	'constants/RDFNS',
    'collections/file/FilesCollection',
    'views/file/FileListItemView',
    'text!templates/file/fileListTemplate.html',
    'views/FilterView',
   'text!templates/file/fileFilterTemplate.html'
], function ($, _, BaseView, logging, Vm, session, RDFNS, FilesCollection, FileListItemView, fileListTemplate, FilterView, fileFilterTemplate) {

    var log = logging.getLogger("FileListView");

    return BaseView.extend({

//        className: "list-container",

        template: fileListTemplate,

        itemView: FileListItemView,

        hideLoadingIndicator: function () {
            if (this.collection.listAvailable().length === 0) {
                this.$el.append("No Files found.");
            }
            this.$(".loading-indicator").hide();
        },

        initialize: function () {
            this.collection.on('sync', this.render, this);
            this.collection.on('sync', this.hideLoadingIndicator, this);
            this.collection.on('error', this.hideLoadingIndicator, this);
        },

        renderFilterBar: function() {
          var that = this;
          var filterbar = new FilterView({
            el: that.$(".filter-bar"),
            collection: this.collection,
          });
          filterbar.template = fileFilterTemplate;
          filterbar.listToFilter = this.$(".file-list");
          // session.user.on("sync", this.renderFilterBar, this);
          filterbar.render();

            session.user.on("sync", this.renderFilterBar, this);

            var globalUserFilter = {};
            if (session.user.getQN("omnom:globalUserFilter") === 'true'
                ||
                session.user.getQN("omnom:globalUserFilter") === true
               ) {
              globalUserFilter[RDFNS.expand("omnom:fileOwner")] = session.user.id;
            }
            filterbar.applyFilters(globalUserFilter);
        },

        render: function () {
            this.renderModel({ fileService: this.collection.url() });
//            console.warn(this.el);
            this.renderCollection({}, '.file-list');
            this.renderFilterBar();
            return this;
        },

    });

});
