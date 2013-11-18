//Filename: ParameterAssignmentView.js

define([
    'jquery',
    'underscore',
    'logging',
    'vm',
    'BaseView',
    'util/UriUtils',
    'text!templates/config/parameterAssignmentTemplate.html'
], function($,
            _,
            logging,
            Vm,
            BaseView,
            UriUtils,
            theTemplate
    ) {

    var log = logging.getLogger("ParameterAssignmentView");

    return BaseView.extend({

        template : theTemplate,

        events : {
            // FIXME
            "focusout input[name=paramValue]": function() { this.populateModelFromForm(); },
        },

        populateModelFromForm : function() {
            if (this.$("input[name=paramValue]").val() !== "") {
                this.model.setQN("omnom:parameterValue", this.$("input[name=paramValue]").val());
            }
            log.debug("Model updated.");
            console.log(this.model);
        },
        drop : function(event, ui) {
            var droppedModel = ui.draggable.data("model");
            console.log(droppedModel.absoluteURL());
            this.$("input[name=paramValue]").val(droppedModel.absoluteURL());
            this.populateModelFromForm();
        },
        accept: function(draggable) {
            return true;
        },
        render: function() {

            this.renderModel();

            this.$el.attr("data-forParam", UriUtils.last_url_segment(this.model.getQN("omnom:forParam").id));

            var that = this;
            this.$el.droppable({
                drop : function(event, ui) { return that.drop(event, ui); },
                accept : function(draggable) { return that.accept(draggable); },
                activeClass: "drop-active",
                hoverClass: "drop-hover",
            });

            return this;
        },

//        initialize : function() {
//            this.listenTo(this.model, "change", this.render);
//        },

    });
});
