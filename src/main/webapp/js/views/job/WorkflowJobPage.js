//Filename: JobPage.js

define([
    'jquery',
    'underscore',
    'logging',
    'vm',
    'util/dialogs',
    'constants/RDFNS',
    'BaseView',
    'models/workflow/WorkflowModel',
    'text!templates/job/workflowJobPageTemplate.html'
], function($,
    _,
    logging,
    Vm,
    dialogs,
    RDFNS,
    BaseView,
    WorkflowModel,
    workflowJobTemplate
    ) {

    var log = logging.getLogger("views/job/JobPage");

    return BaseView.extend({

        template : workflowJobTemplate,

        events : {
            "click #job-refresh" : function() {
                this.refreshJob();
                this.refreshLog();
                this.render();
            }
        },

        initialize : function(options) {
            this.workflow = WorkflowModel.findOrCreate(
                this.model.getQN("omnom:workflow")
            );
            this.workflow.url = this.model.getQN("omnom:workflow").id;
            this.workflow.fetch({async:true});
            console.log(this.workflow);
            this.listenTo(this.model, "change", this.render);
            this.workflowLog = "";
            this.positionLogs = {};
            this.refreshLog();
        },

        renderProgressBar : function() {
            var progress = 100 *
                ( this.model.getQN("omnom:finishedPosition").length /
                 this.workflow.getQN("omnom:workflowPosition").length );
            this.$("div.progress div.bar").css("width", progress + "%");
        },

        refreshJob : function() {
            this.model.fetch();
        },

        refreshLog : function() {
            var that = this;

            // retrieve workflow log messages
            $.ajax({
                url : this.model.id + "/log",
                type : "GET",
                headers : {
                    Accept : "text/x-log"
                },
                complete : function(jqXHR) {
                    if (jqXHR > 200) {
                        dialogs.notify("Could not retrieve log messages.", 'error');
                    } else {
                        that.workflowLog = jqXHR.responseText;
                        that.model.trigger("change");
                    }
                }
            });
            // TODO retrieve current job
            $.ajax({
                url: this.model.id + "/relatedJobs",
                dataType: "json",
                complete: function(jqXHR) {
                    console.log(jqXHR.reponseText);
                },
                success: function(data) {
                    console.log(data);
                }
            });
                // console.log(curJob);
                // $.ajax({
                    // url: curJob.id,
                    // dataType: 'json',
                    // complete : function(jqXHR) {
                        // console.error(jqXHR.responseText);
                    // },
                    // success : function(data) {
                        // var curPosLogURL = RDFNS.rdf_attr("omnom:executesPosition", data);
                        // console.error(data);
                        // console.error(curPosLogURL);
                        // // this.positionLogs[curJob.id] = logStr;
                        // // console.error(jqXHR.responseText);
                    // },
                // });
            // TODO retrieve finished jobs
            // console.log(this.model);
            // .each(rdf_attr("omnom:workflowPosition", workflow), function(pos) {
              // var thisId = pos.
            // });
        },

        renderLog: function () {
            this.$("pre#workflow-job-log").html(this.workflowLog);
        },
        render : function() {
            this.renderModel({ workflow: this.workflow.toJSON() });
            this.renderLog();
            this.renderProgressBar();
            // FIXME I smell infinite recursion
            // this.refreshLog();
        }

    });
});
