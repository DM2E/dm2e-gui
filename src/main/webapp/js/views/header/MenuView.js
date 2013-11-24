define([
	'jquery',
	'underscore',
	'BaseView',
	'logging',
    'util/themeSwitcher',
    'util/dialogs',
	'singletons/UserSession',
	'text!templates/header/menuTemplate.html'
], function($,
	_,
	BaseView,
	logging,
    themeSwitcher,
    dialogs,
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
            },
            "click #mystuff-filter" : function(e) {
                var onoff = this.$("#mystuff-filter").is(':checked');
                session.user.setQN("omnom:globalUserFilter", onoff);
                session.user.save({}, {
                    success : function() {
                        dialogs.notify("Persisted 'My Stuff' choice: " + onoff);
                    }
                });
            }
        },
		initialize : function() {
			log.trace("MenuView initialized.");
			this.model = session.user;

		},
		render : function() {
            this.renderModel();
            this.$("#switch-theme").html(session.user.getQN("omnom:preferredTheme"));
            // console.error('global filter: ' + session.user.getQN("omnom:globalUserFilter"));
            // console.error(session.user.attributes);
            if (session.user.getQN("omnom:globalUserFilter") === 'true') {
                this.$("#mystuff-filter").attr('checked', 'checked');
            } else {
                this.$("#mystuff-filter").removeAttr('checked');
            }
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
