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
    'views/filter/QueryFilterView',
], function (
    $,
    _,
    BaseView,
    logging,
    Vm,
    session,
    RDFNS,
    FilesCollection,
    FileListItemView,
    fileListTemplate,
    QueryFilterView) {

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

        initialize: function (options) {
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
            this.collection.on('sync', this.render, this);
            this.collection.on('sync', this.hideLoadingIndicator, this);
            this.collection.on('error', this.hideLoadingIndicator, this);
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
                    log.debug("FilesCollection retrieved, size: " + collection.models.length);
                    // that.render();
                },
                error: function(collection, resp) {
                    log.warn("Error retrieving collection");
                    console.error(resp);
                },
            });
        },

        render: function () {
            this.renderModel({ fileService: this.collection.url() });
//            console.warn(this.el);
            this.renderCollection({}, '.file-list');
            // TODO check for zombies
            var filterView = new QueryFilterView({
                $el : this.$(".filter-bar"),
                parentView: this,
                showOrHide: 'hide',
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
            // this.renderFilterBar();
            return this;
        },

    });

});
