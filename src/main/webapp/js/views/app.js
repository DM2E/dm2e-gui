//Filename: app.js

define([
	'logging',
	'vm',
	'BaseView',
	'views/header/MenuView',
	'text!templates/layout.html',

	// these are just loaded for use in other views/models/whatever
	'bootstrap',
	'jquery_ui',
	'backbone_bootstrap_modal',
	'jquery',
	'sorttable',
	'bootstrap_jasny_fileupload',
	// 'jquery_file_upload',
    'bootstrap_notify'
], function(
	logging,
	Vm,
	BaseView,
	HeaderMenuView,
	layoutTemplate) {

  /**
   * @module views.app
   */

	var log = logging.getLogger("app.js");

	return BaseView.extend({

		el : '.app-container',

        template : layoutTemplate,

		initialize : function() {

			// load top menu
			this.headerView = Vm.createView(this, "HeaderMenuView", HeaderMenuView);
		},

		render : function() {

			this.$el.html(layoutTemplate);

			this.assign(this.headerView, '.main-menu-container');
			if (this.pageView) {
				this.assign(this.pageView, '#page');
			}
			log.debug("DONE rendering page ");

		},

		/**
		 * Display a view full-page by setting this.pageView to it and rendering.
		 * @instance
		 */
		showPage : function(view) {
			log.debug("Rendering page");
			this.pageView = view;
			this.render();
		}

	});
});
