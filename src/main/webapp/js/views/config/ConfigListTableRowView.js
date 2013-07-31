define([
        'jquery',
        'underscore',
        'BaseView',
        'logging',
        'vm',
        'constants/RDFNS',
        'text!templates/config/configListTableRowTemplate.html'
], function($,
    _,
    BaseView,
    logging,
    Vm,
    NS,
    configListTableRowTemplate) {

    var log = logging.getLogger("views.config.ConfigListTableRowView");

    return BaseView.extend({

        tagName: 'tr',

        template: configListTableRowTemplate,

    });
});
