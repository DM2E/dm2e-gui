define([
    'jquery',
    'underscore',
    'BaseView',
    'logging',
    'sorttable',
    'vm',
    'constants/RDFNS',
    'collections/file/FilesCollection',
    'views/file/FileManagerListItemView',
    'text!templates/file/fileManagerListTemplate.html',
    'views/FilterView',
	'text!templates/file/fileFilterTemplate.html'
], function($,
    _,
    BaseView,
    logging,
    sorttable,
    Vm,
    RDFNS,
    FilesCollection,
    FileManagerListItemView,
    fileManagerListTemplate,
    FilterView,
    fileFilterTemplate) {

    var log = logging.getLogger("views.file.FileManageListView");

    return BaseView.extend({

        template : fileManagerListTemplate,

        itemView: FileManagerListItemView,

        listSelector: '.file-list',

        hideLoadingIndicator : function() {
            if (this.collection.listAvailable().length === 0) {
                this.$el.append("No Files found.");
            }
            this.$(".loading-indicator").hide();
            // TODO load renderFilterBar here
        },

        renderFilterBar: function() {
            var that = this;
            var filterbar = new FilterView({
                collection: this.collection,
                el: this.$(".filter-bar"),
            });
            filterbar.template = fileFilterTemplate;
            filterbar.tableToFilter = this.$("table");
            filterbar.render();
        },

        initialize : function() {
            this.collection.on('remove', this.render, this);
            this.collection.on('remove', this.hideLoadingIndicator, this);
            this.collection.on('sync', this.hideLoadingIndicator, this);
            this.collection.on('sync', this.renderFilterBar, this);
        },

        render : function() {
            this.renderModel({serviceURL: this.collection.url()});
            this.renderCollection();
            sorttable.makeSortable(this.$("table")[0]);
            sorttable.innerSortFunction.apply(this.$("th", $("table")[0])[3]);
            return this;
        },

    });

});
