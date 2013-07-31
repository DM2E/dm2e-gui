define([
        'jquery',
        'underscore',
        'BaseView',
        'logging',
        'vm',
        'constants/RDFNS',
        'text!templates/job/jobListTableRowTemplate.html'
], function($,
    _,
    BaseView,
    logging,
    Vm,
    NS,
    theTemplate) {

    var log = logging.getLogger("views.job.JobListTableRowView");

    return BaseView.extend({

        tagName: 'tr',

        template: theTemplate,

    });
});
