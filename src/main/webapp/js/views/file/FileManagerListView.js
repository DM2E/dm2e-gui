define([
    'jquery',
    'underscore',
    'BaseView',
    'logging',
    'sorttable',
    'vm',
    'singletons/UserSession',
    'constants/RDFNS',
    'util/UriUtils',
    'collections/file/FilesCollection',
    'views/file/FileManagerListItemView',
    'views/filter/QueryFilterView',
    'text!templates/file/fileManagerListTemplate.html',
], function($,
    _,
    BaseView,
    logging,
    sorttable,
    Vm,
    session,
    RDFNS,
    UriUtils,
    FilesCollection,
    FileManagerListItemView,
    QueryFilterView,
    fileManagerListTemplate) {

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
        },


        initialize : function(options) {
            this.parentView = options.parentView;
            this.serviceURL = options.serviceURL;
            this.queryParams = options.queryParams;
            this.collection.on('remove', this.render, this);
            this.collection.on('sync', this.render, this);
            this.collection.on('reset', this.render, this);
            this.collection.on('remove', this.hideLoadingIndicator, this);
            this.collection.on('sync', this.hideLoadingIndicator, this);
            // this.collection.on('sync', this.renderFilterBar, this);
        },

        render : function() {
            // var nextPageHref = "",
            //     prevPageHref = "",
            //     fileManagerBase = '#file-list/';
            // if (this.queryParams.start > 0) {
            //     var prevIdx = this.queryParams.start - this.queryParams.limit;
            //     if (prevIdx < 0) { prevIdx = 0; }
            //     prevPageHref = fileManagerBase + 
            //                    this.serviceURL +
            //                    '?' +
            //                    'start=' +
            //                    prevIdx + 
            //                    '&' +
            //                    'limit=' + 
            //                    this.queryParams.limit;
            // }
            // nextPageHref = fileManagerBase + 
            //                this.serviceURL +
            //                '?' +
            //                'start=' +
            //                (+this.queryParams.start + +this.queryParams.limit) + 
            //                H
            //                '&' +
            //                'limit=' + 
            //                this.queryParams.limit;
            // console.log(prevPageHref);
            // console.log(nextPageHref);
            this.renderModel({
                serviceURL: this.serviceURL,
            });
            // _.each(this.parentView.collection.models, function(it) { console.log(it.attributes['http://onto.dm2e.eu/omnom/fileType']); });
            var filterView = new QueryFilterView({
                $el : this.$(".filter-bar"),
                parentView: this.parentView,
                facets: [
                    {'queryParam': 'user',
                     'label': 'Owner',
                     'rdfProp' : RDFNS.expand('omnom:fileOwner')},
                    {'queryParam': 'type',
                     'label': 'Type',
                     'rdfProp' : RDFNS.expand('omnom:fileType')},
                ],
                sortOpts: {
                    'owner' : RDFNS.expand('omnom:fileOwner'),
                    'type' : RDFNS.expand('omnom:fileType'),
                    'created' : RDFNS.expand('dcterms:created'),
                },
            });
            filterView.render();
            // sorttable.makeSortable(this.$("table")[0]);
            // sorttable.innerSortFunction.apply(this.$("th", $("table")[0])[3]);
            this.renderCollection();
            return this;
        },

    });

});
