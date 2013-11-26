//Filename: filename

define([
    'jquery',
    'underscore',
    'logging',
    'BaseCollection',
    'models/workflow/WorkflowModel',
], function($,
    _,
    logging,
    BaseCollection,
    WorkflowModel
   ) {

     var log = logging.getLogger("WorkflowCollection.js");

    return BaseCollection.extend({

        model : WorkflowModel,

        url : function() { return 'api/workflow/list'; },

    });
});
