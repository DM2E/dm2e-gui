//Filename: FileUploadPage.js

define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
	'vm',
	'singletons/UserSession',
    'util/dialogs',
	'constants/RDFNS',
	'text!templates/file/fileUploadTemplate.html',
], function($,
	_,
	BaseView,
	logging,
	Vm,
	session,
    dialogs,
	NS,
	fileUploadTemplate) {

	var log = logging.getLogger("FileUploadPage.js");

	return BaseView.extend({

        template : fileUploadTemplate,

		events : {

			"click #submit-upload" : function(e) {
				e.preventDefault();

				var now = new Date();

                var blank = "_:foo ";
                var metaStr = '';
				metaStr += blank + ' a <' + NS.expand('omnom:File') + '> .\n';
                metaStr += blank + ' <' + NS.expand('omnom:fileOwner') + '> <' + session.user.id + '>.\n';
                metaStr += blank + ' <' + NS.expand('omnom:fileType') + '> <' + this.$("#inputFiletype").val() + '>.\n';
                if (this.$("#inputFileLabel").val()) {
                    metaStr += blank + ' <' + NS.expand('omnom:originalName') + '> "' + this.$("#inputFileLabel").val() + '".\n';
                }
				metaStr += blank + ' <' + NS.expand('dcterms:modified') + '> "' + now.toISOString() + '".\n';
                console.log(metaStr);

				var fileInput = this.$("input:file");
				var fileInputFile = fileInput.get(0).files[0];

				var fd = new FormData();
				fd.append("file", fileInput.get(0).files[0]);
				fd.append("meta", metaStr);
				console.log(fd);
				$.ajax({
					url : 'api/file',
					data : fd,

					cache : false,
					processData : false,

					type : 'POST',

					// This will override the content type header,
					// regardless of whether content is actually sent.
					// Defaults to 'application/x-www-form-urlencoded'
					contentType : false,

					// Now you should be able to do this:
					mimeType : 'multipart/form-data', // Property added in 1.5.1

					success : function(data, textStatus, xhr) {
						dialogs.notify("Uploaded file as " + xhr.getResponseHeader("Location") );
						Vm.navigateTo("file-list/api/file");
					},
					error : function(xhr) {
						log.info("errror :(");
						console.log(xhr);
						// console.log($.httpData(xhr));
						console.log(xhr.status);
						console.log(xhr.responseText);
					},

				});
				// var filename=$("input:file").val().replace("C:\\fakepath\\",
				// "");
				// var jqXHR = $("#upload-control").fileupload('send', {
				// formData: function (form) {
				// var arr = form.serializeArray();
				// arr.push({
				// name: "filename",
				// value: filename
				// });
				// return arr;
				// },
				// fileInput: $("input:file")
				// });
			}
		},

		render : function() {

//			var that = this;

            this.renderModel();

//			this.$el.html(fileUploadTemplate);

			// intercept submit click
			// $("#submit-upload").click(handleUpload);

			this.renderFileTypeSelection();

			log.info("Rendered FileUploadPage");

			return this;
		},

		renderFileTypeSelection : function() {

			//noinspection JSUnresolvedFunction
            _.each(NS.OMNOM_TYPES(), function(url_func, label) {
                // skip the filetype if it contians lowercase characters or is BASE
                if (label === 'BASE' || ! /^[^a-z]+$/.test(label)) {
                    return;
                }
                console.log(label);
				this.$("select#inputFiletype").append($("<option>")
					.attr("value", url_func()).append(label));
			}, this);
		}

	});
});
