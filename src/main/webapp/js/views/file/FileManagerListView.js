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
    'views/file/FileFilterView',
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
    FileFilterView,
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
            var filterbar = new FileFilterView({
                collection: this.collection,
                el: this.$(".filter-bar"),
            });
            filterbar.template = fileFilterTemplate;
            filterbar.tableToFilter = this.$("table");
            filterbar.render();
            // filterbar.bind('filter', function(currentFilters) {
                // that.$("tr").removeClass('filtered');
                // _.each(currentFilters, function(value, property) {
                    // _.each(that.$("tbody tr"), function(tr){
                        // var td = $("td[data-filter-property='" + property + "']", tr);
                        // console.log(tr);
                        // if ($(td).attr('data-filter-value') !== value) {
                            // $(tr).addClass('filtered');
                        // }
                    // });
                // });
            // });
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
