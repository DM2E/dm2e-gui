define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
    'util/themeSwitcher',
	'singletons/UserSession',
	'text!templates/header/menuTemplate.html'
], function($,
	_,
	BaseView,
	logging,
    themeSwitcher,
	session,
	menuTemplate) {

	var log = logging.getLogger("MenuView");

	var HeaderMenuView = BaseView.extend({
		
		template: menuTemplate,

        events: {
            "click #switch-theme" : function() {
                themeSwitcher.toggle();
                session.user.setQN("omnom:preferredTheme", themeSwitcher.getTheme());
                session.user.save();
                this.render();
            }
        },
		initialize : function() {
			log.trace("MenuView initialized.");
			this.model = session.user;
		},
		render : function() {
            this.renderModel();
            this.$("#switch-theme").html(session.user.getQN("omnom:preferredTheme"));
        },
//			this.$el.html(_.template(menuTemplate, {
//				user : session.get("user")
//			}));
//			$('a[href="' + window.location.hash + '"]').parent().addClass('active');
//			return this;
//		},
//		events : {
//			'click a' : 'highlightMenuItem'
//		},
//		highlightMenuItem : function(ev) {
//			$('.active').removeClass('active');
//			$(ev.currentTarget).parent().addClass('active');
//		}
	});

	return HeaderMenuView;
});
