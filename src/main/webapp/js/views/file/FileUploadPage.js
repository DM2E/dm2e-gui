//Filename: FileUploadPage.js

define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
	'vm',
    'util/dialogs',
	'constants/RDFNS',
	'text!templates/file/fileUploadTemplate.html',
], function($,
	_,
	BaseView,
	logging,
	Vm,
    dialogs,
	RDFNS,
	fileUploadTemplate) {

	var log = logging.getLogger("FileUploadPage.js");

	return BaseView.extend({

        template : fileUploadTemplate,

		events : {

			"click #submit-upload" : function(e) {
				e.preventDefault();

				var fileInput = this.$("input:file");
				var fileInputFile = fileInput.get(0).files[0];
                console.log(fileInputFile);
				var fd = new FormData();
				fd.append("file", fileInput.get(0).files[0]);
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

//					// Before 1.5.1 you had to do this:
//					beforeSend : function(x) {
//						if (x && x.overrideMimeType) {
//							x.overrideMimeType("multipart/form-data");
//						}
//					},

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
            _.each(RDFNS.OMNOM_TYPES(), function(url_func, label) {
                // skip the filetype if it contians lowercase characters or is BASE
                if (label === 'BASE' || ! /^[^a-z]+$/.test(label))
                    return;
                console.log(label);
				this.$("select#inputFiletype").append($("<option>")
					.attr("value", url_func()).append(label));
			}, this);
		}

	});
});
