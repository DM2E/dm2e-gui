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
        'views/file/FileListView',
        'views/config/ParameterAssignmentView',
        'collections/file/FilesCollection',
        'text!templates/config/ConfigEditorTemplate.html'
], function($, _, logging, Vm, BaseView, NS, dialogs, session, FileListView, ParameterAssignmentView,
    FilesCollection, theTemplate) {

    var log = logging.getLogger("views.config.ConfigEditorPage");

    return BaseView.extend({

        template: theTemplate,

        fileCollections: {},

        events: {
            //            "click button#workflow-edit": function () {
            //                var that = this;
            //                window.location.hash = "workflow-edit/" + this.model.getQN("omnom:workflow").id;
            //            },
            "click button#save-config": function() {
                this.saveConfig();
            },
            "click button#run-config": function() {
                //                var button = this.$("button#run-config");
                //                $("span", button).addClass("loading-indicator");
                this.setButtonLoading("button#run-config");
                var that = this;
                this.saveConfig();
                var config = this.model;
                console.warn("PUT " + config.getQN("omnom:webservice").id);
                $.ajax({
                    url: config.getQN("omnom:webservice").id,
                    type: "PUT",
                    processData: false,
                    dataType: "json",
                    contentType: "text/plain",
                    data: config.id,
                    complete: function(jqXHR, textStatus, err) {
                        var jobLoc = jqXHR.getResponseHeader("Location");
                        if (jqXHR.status === 202) {
                            //                            dialogs.errorXHR(jqXHR);
                            dialogs.notify("Job started " + jobLoc);
                            window.location.hash = 'job/' + jobLoc;
                        } else {
                            dialogs.notify(jqXHR.status, 'error');
                        }
                        that.unsetButtonLoading("button#run-config");
                    },
                });
                // FIXME TODO
                //                ).complete(function (data, textStatus, jqXHR) {
                //                    var jobLoc = jqXHR.getResponseHeader("Location");
                //                    if (jqXHR.status === 202) {
                //                        dialogs.errorXHR(jqXHR);
                ////                            dialogs.notify("Job started " + jobLoc);
                //                    } else {
                //                        dialogs.notify(textStatus, 'error');
                //                    }
                //                    dialogs.notify("Run executed.");
                //                });
            }
        },

        saveConfig: function() {
            var that = this;
            this.model.setQN("rdfs:label", $("#config-label").val());
            this.model.setQN("dcterms:creator", {"id":session.user.id});
            this.model.setQN("dcterms:modified", new Date().toISOString());
            this.model.save().then(function(data, textStatus, xhr) {
                if (xhr.status === 201) {
                    dialogs.notify("Saved WorkflowConfig " + that.model.id);
                }
                else {
                    dialogs.notify(xhr.statusText, 'error');
                }
            });

        },

        initialize: function() {
            //            this.listenTo(this.model, "change", this.render);
            _.each(NS.rdf_attr("omnom:fileservice", session), function(fileService) {
                // FIXME this might not be very efficient in the long run...
                this.fileCollections[fileService.id] = new FilesCollection([], {
                    url: fileService.id,
                });
                this.fileCollections[fileService.id].fetch();
            }, this);
            // this.listenTo(this.model.getQN("omnom:assignment"), "change", this.saveConfig);
        },

        render: function() {
            var workflowURL = this.model.get(NS.expand("omnom:webservice")).id.replace("/exec/", "/");
            this.renderModel({'workflowURL' : workflowURL});
            Vm.cleanupSubViews(this);
            this.renderResourceLists();
            this.renderParameterList();
            return this;
        },

        renderParameterList: function() {
            _.each(this.model.getQN("omnom:assignment").models, function(ass) {
                // console.error(ass);
                var assView = Vm.createSubView(this, ParameterAssignmentView, {
                    model: ass
                });
                this.appendHTML(assView, '.parameter-assignment-list');
            }, this);
        },

        renderResourceLists: function() {
          _.each(this.fileCollections, function(coll, collName) {
            var collId = collName.replace(/[^a-zA-Z0-9-]/g, '');
            $("#config-resource-nav").append(
              $('<li></li>').append(
                $('<a ></a>')
                .attr('data-toggle', 'tab')
                .attr("href", "#" + collId)
                .attr("data-omnom-fileservice", collId)
                // .on('click', function() { $(this).tab('show');})
                .append(collName)));
                $(".tab-content").append(
                  $("<div></div>")
                  .addClass("tab-pane")
                  .attr("id", collId)
                  .append(collId));
                  var subview = Vm.createSubView(this, FileListView, {
                    collection: this.fileCollections[collName]
                  });
                  this.assign(subview, "#" + collId);


                  // this.$(".resource-list").append("<div data-omnom-fileservice='" + collName + "']> </div>");
                  // console.warn(subview);
                  // this.assign(subview, "div[data-omnom-fileservice='" + collName + "']");
          }, this);

          // show first tab
          // window.setTimeout(function(){
            $("#config-resource-nav a:first").tab('show');
          // }, 2000);
        },

    });
});
