define([
    'jquery',
    'underscore',
    'BaseView',
    'logging',
    'vm',
    'singletons/UserSession',
    'constants/RDFNS',
    'collections/file/FilesCollection',
    'views/file/FileManagerListView',
    'text!templates/file/fileManagerTemplate.html'
], function(
    $,
    _,
    BaseView,
    logging,
    Vm,
    session,
    RDFNS,
    FilesCollection,
    FileManagerListView,
    fileManagerTemplate
) {

    var log = logging.getLogger("FileManagerView");

    return BaseView.extend({

        className : "file-manager-page",

        initialize : function(options_arg) {

            var options = options_arg || {};
            var that = this;

            this.queryParams = options.queryParams ? options.queryParams : {};
            if (! this.queryParams.start) { this.queryParams.start = 0; }
            if (! this.queryParams.limit) { this.queryParams.limit = 200; }
            if (! this.queryParams.sort) { this.queryParams.sort = RDFNS.expand("dcterms:created"); }
            if (! this.queryParams.order) { this.queryParams.order = 'desc'; }
            if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                this.queryParams.user = session.user.id;
            }
            this.listenTo(session.user, "change", function() {
                if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                    this.queryParams.user = session.user.id;
                } else {
                    delete this.queryParams.user;
                }
                this.fetchCollection();
            }, this);


            if (options.selectedFileService) {
                this.serviceURL = options.selectedFileService;
                this.collection = new FilesCollection([], {
                    url: this.serviceURL + "/list" 
                });
                // this.collection.on('reset', this.render, this);
                // this.collection.on('sync', this.render, this);
                this.fetchCollection();
            }
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

        render : function() {

            this.$el.html(this.createHTML(fileManagerTemplate));

            if (this.collection) {
                this.renderFileList();
            }

            return this;
        },

        renderFileList : function() {
            this.fileListView = Vm.createView(this, 'FileManagerListView', FileManagerListView, {
                parentView : this,
                serviceURL: this.serviceURL,
                collection : this.collection,
                queryParams: this.queryParams,
            });
            this.assign(this.fileListView, 'div.file-list');
        },

        clean : function() {
            log.debug("Removing collection object.");
            if (typeof this.collection !== 'undefined') {
                this.collection.reset();
            }
        }

    });
});
