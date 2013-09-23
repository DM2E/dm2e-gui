define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
	'sorttable',
	'vm',
	'collections/file/FilesCollection',
	'views/file/FileManagerListItemView',
	'text!templates/file/fileManagerListTemplate.html'
], function($,
	_,
	BaseView,
	logging,
	sorttable,
	Vm,
	FilesCollection,
	FileManagerListItemView,
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

		initialize : function() {
			this.collection.on('remove', this.render, this);
			this.collection.on('remove', this.hideLoadingIndicator, this);
			this.collection.on('sync', this.hideLoadingIndicator, this);
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
