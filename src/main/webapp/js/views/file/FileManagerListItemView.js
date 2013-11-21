//Filename: FileManagerListItemView

define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
	'vm',
	'util/dialogs',
	'constants/RDFNS',
	'text!templates/file/fileManagerListItemTemplate.html',
	'text!templates/file/fileEditTemplate.html',

], function($, _, BaseView, logging, Vm, dialogs, NS, itemTemplate, formTemplate) {

	var log = logging.getLogger('FileManagerListItemView.js');

	return BaseView.extend({

		tagName: 'tr',

		template: itemTemplate,

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

		events: {
			"click .btn-file-edit": function(e) {
                this.showForm();
            },
			"click .btn-file-delete": function(e) {
				console.log("Destroying model " + this.model.url());
				this.model.destroy({
					wait: true,
					error: function(model, xhr) {
						log.error("Could not destroy this file model.");
						dialogs.errorXHR(xhr);
					},
					success: function(model, xhr) {
						log.info("Successfully destroyed this file model.");
						dialogs.notify("Deleted file");
					}
				});
			},
		},

        showForm: function() {
            var that = this;
            console.log(this);
            this.formView = Vm.createView(this, 'ModalView', BaseView.extend({
                model: this.model,
                tagName : 'form',
                template: formTemplate,
                initialize: function(options) {
                    this.bind("ok", function() {
                        this.handleMetadataSave();
                    });
                },
                render: function() {
                    this.renderModel();
                    this.renderFileTypeSelection();
                },
                renderFileTypeSelection : function() {
                    console.log(this);
                    _.each(NS.OMNOM_TYPES(), function(url_func, label) {
                        // skip the filetype if it contians lowercase characters or is BASE
                        if (label === 'BASE' || ! /^[^a-z]+$/.test(label)) {
                            return;
                        }
                        console.log( this.$("select#inputFiletype"));
                        this.$("select#inputFiletype")
                            .append($("<option>")
                                    .attr("value", url_func())
                                    .append(label))
                            .val(this.model.getQN("omnom:fileType"));
                    }, this);
                },
                handleMetadataSave: function() {
                    var now = new Date();

                    // HACK this should be the model ID but that's just the local part of the URI
                    //
                    var fileRes = this.model.getQN("omnom:fileRetrievalURI");
                    var fileResTTL = "<" + fileRes + ">";
                    var metaStr = '';
                    metaStr += fileResTTL + ' a <' + NS.expand('omnom:File') + '> .\n';
                    metaStr += fileResTTL + ' <' + NS.expand('omnom:fileType') + '> <' + this.$("#inputFiletype").val() + '>.\n';
                    this.model.setQN("omnom:fileType", this.$("#inputFiletype").val());
                    if (this.$("#inputFileLabel").val()) {
                        this.model.setQN("omnom:originalName", this.$("#inputFileLabel").val());
                        metaStr += fileResTTL + ' <' + NS.expand('omnom:originalName') + '> "' + this.$("#inputFileLabel").val() + '".\n';
                    }
                    metaStr += fileResTTL + ' <' + NS.expand('dcterms:modified') + '> "' + now.toISOString() + '".\n';
                    // FilePojo default value would overwrite this otherwise
                    metaStr += fileResTTL + ' <' + NS.expand('dcterms:extent') + '> "' + this.model.getQN("dcterms:extent") + '".\n';
                    console.log(metaStr);

                    var fd = new FormData();
                    fd.append("meta", metaStr);
                    console.log(fd);
                    $.ajax({
                        url : fileRes + '/patch',
                        data : metaStr,
                        cache : false,
                        processData : false,
                        type : 'POST',
                        // This will override the content type header,
                        // regardless of whether content is actually sent.
                        // Defaults to 'application/x-www-form-urlencoded'
                        // contentType : false,
                        // Now you should be able to do this:
                        // mimeType : 'text/turtle',
                        headers: { 
                            "Accept" : "text/turtle",
                            "Content-Type": "text/turtle"
                        },
                        success : function(data, textStatus, xhr) {
                            dialogs.notify("Changed metadata YAY");
                            // Vm.navigateTo("file-list/api/file");
                        },
                        error : function(xhr) {
                            log.info("errror :(");
                            console.log(xhr);
                            // console.log($.httpData(xhr));
                            console.log(xhr.status);
                            console.log(xhr.responseText);
                        },

                    });
                },

            }));
            this.modalView = new Backbone.BootstrapModal({
                content: this.formView,
                //				okCloses : false,
            });
            this.modalView.open();
        },

		render: function() {
			this.renderModel();
			// if (this.model.get("fileEditURI")) {
			//     this.$(".btn-file-edit").removeClass("disabled");
			// }
			//			if (this.model.get("fileRetrievalURI")) {
			//				this.$(".btn-file-delete").removeClass("disabled");
			//			}
			return this;
		}

	});
});
