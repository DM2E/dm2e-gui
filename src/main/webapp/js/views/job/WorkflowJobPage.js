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
    'collections/job/AssignmentCollection',
    'models/job/AssignmentModel',
    'views/job/AssignmentTableRowView',
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
    AssignmentCollection,
    AssignmentModel,
    AssignmentTableRowView,
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
            var workflowID = this.model.getQN("omnom:webservice").id.replace("/exec/", "/");
            console.log(workflowID);
            this.workflow = WorkflowModel.findOrCreate({"id": workflowID});
            console.log(this.workflow);
            this.workflow.url = workflowID;
            this.workflow.fetch({async:true});
            console.log(this.workflow);
            this.listenTo(this.model, "change", this.render);
            this.workflowLog = "";
            this.relatedJobAssignments = [];
            this.refreshLog();
        },

        renderProgressBar : function() {
            if (this.model.getQN("omnom:status") === 'FINISHED') {
                this.$("div.progress div.bar-success").css("width", "100%");
            } else if (this.model.getQN("omnom:status") === 'FAILED') {
                this.$("div.progress div.bar-fail").css("width", "100%");
            } else {
                var progress = 10 * this.model.getQN("omnom:finishedJobs").length;
                this.$("div.progress div.bar-success").css("width", progress + "%");
            }
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
                    if (jqXHR.status > 200) {
                        dialogs.notify("Could not retrieve log messages.", 'error');
                    } else {
                        that.workflowLog = jqXHR.responseText;
                        that.model.trigger("change");
                        that.renderLog();
                    }
                }
            });
            /**
             * Retrieve logs
             */
            // $.ajax({
            //     url: this.model.id + "/relatedJobs",
            //     dataType: "json",
            //     success: function(data) {
            //         console.log(data);
            //         // for each relatedJob
            //         that.relatedJobAssignments = [];
            //         _.each(data, function(subJob) {
            //             console.error(subJob);
            //             // determine the position
            //             var subJobPos = RDFNS.rdf_attr("omnom:executesPosition", RDFNS.rdf_attr("omnom:webserviceConfig", subJob)).id;
            //             // Store assignments
            //             _.each(RDFNS.rdf_attr("omnom:assignment", subJob), function(ass) {
            //                 that.relatedJobAssignments.push(ass);
            //             });
            //             console.error(subJobPos);
            //             // gather logs
            //             $.ajax({
            //                 url: subJob.id + "/log",
            //                 type : "GET",
            //                 headers : {
            //                     Accept : "text/x-log"
            //                 },
            //                 complete : function(jqXHR) {
            //                     if (jqXHR > 200) {
            //                         dialogs.notify("Could not retrieve log messages.", 'error');
            //                     } else {
            //                         that.positionLogs[subJobPos] = jqXHR.responseText;
            //                         console.error(jqXHR.responseText);
            //                         // trigger change so the page is re-rendered
            //                         that.model.trigger("change");
            //                     }
            //                 }
            //             });
            //         });
            //     }
            // });
        },

        renderLog: function () {
            this.$("pre#workflow-job-log").html(HtmlUtils.html_escape(this.workflowLog));
            // _.each(RDFNS.rdf_attr("omnom:workflowPosition", this.workflow), function(pos) { 
            //     var uid = UriUtils.last_url_segment(pos.id);
            //     $("pre", "#" + uid).html(HtmlUtils.html_escape(this.positionLogs[pos.id]));
            // }, this);
        },
        render: function() {
            this.renderModel({ 
                workflow: this.workflow.toJSON(),
                // positionLogs: this.positionLogs,
            });
            var that = this;
            this.$("a[data-job-load]").click(function() {
                var logToggler = this;
                if ($(logToggler).data("job-log-loaded")) {
                    return;
                }
                var jobUID = $(logToggler).attr("data-job-uid");
                $.ajax({
                    url : $(this).attr("data-job-load") + "/log",
                    type : "GET",
                    headers : {
                        Accept : "text/x-log"
                    },
                    complete : function(jqXHR) {
                        if (jqXHR > 200) {
                            dialogs.notify("Could not retrieve log messages.", 'error');
                        } else {
                            var theLog = jqXHR.responseText;
                            console.log(theLog);
                            // console.log(
                                // $("pre#log-job-" + jobUID)
                            // );
                            $("div#log-job-" + jobUID + " pre").html(jqXHR.responseText);
                            $(logToggler).data("job-log-loaded", true);
                        }
                    }
                });
            });
            var workflowAssignments = new AssignmentCollection(RDFNS.rdf_attr("omnom:assignment", this.model.toJSON()));
            // var theRelatedJobAssignments = new AssignmentCollection(this.relatedJobAssignments); 
            // console.error(theRelatedJobAssignments);
            console.log(this.model);
            this.renderCollection({}, "#workflow-assignments", AssignmentTableRowView, workflowAssignments.models, {});
            // this.renderCollection({}, "#positions-assignments", AssignmentTableRowView, theRelatedJobAssignments.models, {});
            this.renderProgressBar();
            // FIXME I smell infinite recursion
            // this.refreshLog();
        }

   });
});
