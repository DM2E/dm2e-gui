define([
    'jquery', // lib/jquery/jquery
    'underscore', // lib/underscore/underscore
    'BaseView', // lib/backbone/backbone
    'logging', // logging
    'vm',
    'constants/RDFNS',
    'text!templates/workflow/workflowTableRowTemplate.html'
], function($,
            _,
            BaseView,
            logging,
            Vm,
            NS,
            workflowTableRowTemplate
    ) {

    var log = logging.getLogger("views.workflow.WorkflowTableRow");

    return BaseView.extend({

        tagName: 'tr',

        template : workflowTableRowTemplate,

        events : {
            "click #delete-workflow" : function() {
                console.log("Deleting " + this.model.id);
                var thisModel = this.model;
                $.ajax({
                    async: false,
                    url: thisModel.id,
                    type: "DELETE",
                    success: function() {
                        thisModel.collection.remove(thisModel);
                    }
                });
            }
        }

    });
});
