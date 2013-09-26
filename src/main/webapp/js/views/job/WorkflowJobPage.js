//Filename: JobPage.js

define([
    'jquery',
    'underscore',
    'logging',
    'vm',
    'util/dialogs',
    'util/UriUtils',
    'util/HtmlUtils',
    'constants/RDFNS',
    'BaseView',
    'models/workflow/WorkflowModel',
    'text!templates/job/workflowJobPageTemplate.html'
], function($,
    _,
    logging,
    Vm,
    dialogs,
    UriUtils,
    HtmlUtils,
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
            this.relatedJobAssignments = [];
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
            /**
             * Retrieve logs
             */
            $.ajax({
                url: this.model.id + "/relatedJobs",
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    // for each relatedJob
                    that.relatedJobAssignments = [];
                    _.each(data, function(subJob) {

                        console.error(subJob);
                        // determine the position
                        var subJobPos = RDFNS.rdf_attr("omnom:executesPosition", RDFNS.rdf_attr("omnom:webserviceConfig", subJob)).id;

                        // Store assignments
                        _.each(RDFNS.rdf_attr("omnom:assignment", subJob), function(ass) {
                            that.relatedJobAssignments.push(ass);
                        });

                        console.error(subJobPos);
                        // gather logs
                        $.ajax({
                            url: subJob.id + "/log",
                            type : "GET",
                            headers : {
                                Accept : "text/x-log"
                            },
                            complete : function(jqXHR) {
                                if (jqXHR > 200) {
                                    dialogs.notify("Could not retrieve log messages.", 'error');
                                } else {
                                    that.positionLogs[subJobPos] = jqXHR.responseText;
                                    console.error(jqXHR.responseText);
                                    // trigger change so the page is re-rendered
                                    that.model.trigger("change");
                                }
                            }
                        });
                    });
                }
            });
        },

        renderLog: function () {
            this.$("pre#workflow-job-log").html(HtmlUtils.html_escape(this.workflowLog));
            _.each(RDFNS.rdf_attr("omnom:workflowPosition", this.workflow), function(pos) { 
                var uid = UriUtils.last_url_segment(pos.id);
                $("pre", "#" + uid).html(HtmlUtils.html_escape(this.positionLogs[pos.id]));
            }, this);
        },
        render : function() {
            this.renderModel({ 
                workflow: this.workflow.toJSON(),
                positionLogs: this.positionLogs,
                relatedJobAssignments: this.relatedJobAssignments
            });
            this.renderLog();
            this.renderProgressBar();
            // FIXME I smell infinite recursion
            // this.refreshLog();
        }

    });
});
