// Filename: router.js
define([
        'jquery',
        'underscore',
        'backbone',
        'vm',
        'logging',
        'util/dialogs'
], function($, _, Backbone, Vm, logging, dialogs) {

    var log = logging.getLogger("router");

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*foo': 'notFound',
        }
    });

    var initialize = function(args) {

        var appRouter = new AppRouter();

        var appView = args.appView;

        var onError = function(xhr, status, err) {
            dialogs.errorXHR(xhr);
        };


        /**
         * The fallback/default route
         */
        appRouter.on('route:notFound', function() {
            dialogs.errorNotFound();
        });

        /**
         * --- #home --- The home/landing page
         */
        appRouter.route(/(^$|^home$)/, 'showHomePage');
        appRouter.on('route:showHomePage', function() {
            require(['views/home/HomePage'], function(HomePage) {
                var page = Vm.reuseView({}, 'HomePage', HomePage);
                appView.showPage(page);
            });

        });

        /**
         * --- #help --- Shows the help page
         */
        appRouter.route(/help/, 'showHelp');
        appRouter.on('route:showHelp', function() {
            require(['views/help/HelpView'], function(HelpView) {
                var helpView = Vm.reuseView(this, 'HelpView', HelpView, {});
                appView.showPage(helpView);
            });
        });

        /**
         * --- #file-list/{fileService} -- Shows a list of files sorted by file service
         */
        appRouter.route(/file-list\/?([^\?]*)\??(.*)?/, 'showFileManager');
        appRouter.on('route:showFileManager', function(fileService, queryStr) {
            var queryParams= {};
            if (queryStr) {
                console.log(queryStr);
                _.each(queryStr.split('&'), function(kvStr) {
                    var kvArr = kvStr.split('=', 2);
                    queryParams[kvArr[0]] = kvArr[1];
                });
            }
            console.log(queryParams);
            require(['views/file/FileManagerPage'], function(FileManagerPage) {
                var fileManagerPage = Vm.createView({},
                    'FileManagerPage',
                    FileManagerPage,
                    {
                        selectedFileService: fileService,
                        queryParams: queryParams
                    }
                );
                appView.showPage(fileManagerPage);
            });

        });

        /**
         * --- #profile --- Shows the user page / profile
         */
        appRouter.route(/^profile$/, 'showUserPage');
        appRouter.on('route:showUserPage', function() {
            require(['views/user/UserPage'], function(UserPage) {
                appView.showPage(Vm.createView({}, 'UserPage', UserPage));
            });

        });

        /**
         * --- #file-upload --- Shows the file upload page
         */
        appRouter.route(/^file-upload$/, 'showFileUploadPage');
        appRouter.on('route:showFileUploadPage', function() {
            require(['views/file/FileUploadPage'], function(FileUploadPage) {
                var page = Vm.reuseView({}, 'FileUploadPage', FileUploadPage);
                appView.showPage(page);
            });

        });

        /**
         * --- #workflow-edit --- Show the workflow editor.
         * If no workflow is given as URL argumnt, create a new one
         */
        appRouter.route(/workflow-edit\/?(.*)/, 'showWorkflowEditor');
        appRouter.on('route:showWorkflowEditor', function(workflowURL) {

            require([
                    'views/workflow/WorkflowEditorPage',
                    'models/workflow/WorkflowModel',
                    'constants/RDFNS',
            ], function(WorkflowEditorPage, WorkflowModel, RDFNS) {
                var model;
                if (workflowURL) {
                    //                    model = WorkflowModel.findOrCreate({ id: workflowURL});
                    // smelly smelly HACK
                    var TheModel = WorkflowModel.extend({
                        url: workflowURL,
                    });
                    model = new TheModel();
                    log.debug("Retrieving workflow %o", workflowURL);
                    model.url = function() {
                        return workflowURL;
                    };
                    model.fetch({
                        success: function() {
                            appView.showPage(Vm.createView({}, 'WorkflowEditorPage', WorkflowEditorPage, {
                                model: model
                            }));
                        },
                        error: function(model, xhr) {
                            dialogs.errorXHR(xhr);
                        }
                    });
                } else {
                    var modelAsJSON = new WorkflowModel().toJSON();
                    delete modelAsJSON[RDFNS.expand('omnom:isExecutableAt')];
                    console.log(modelAsJSON);
                    $.ajax({
                        async: false,
                        url: '/api/workflow',
                        type: "POST",
                        processData: false,
                        // dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(modelAsJSON),
                        success: function(namedConfigData, status, xhr) {
                            var respLocation = xhr.getResponseHeader("Location");
                            log.debug("Posted worklfow to " + respLocation);
                            appRouter.navigate("workflow-edit/" + respLocation, true);
                        },
                        error: onError,
                    });
                }
            });

        });

        /**
         * --- #workflow-list --- Show the list of workflows
         */
        appRouter.route(/workflow-list/, 'showWorkflowList');
        appRouter.on('route:showWorkflowList', function() {
            require([
                    'views/workflow/WorkflowListPage',
                    'collections/workflow/WorkflowCollection'
            ], function(WorkflowListPage, WorkflowCollection) {
                var collection = new WorkflowCollection();
                //                collection.fetch();
                appView.showPage(Vm.createView({}, 'WorkflowListPage', WorkflowListPage, {
                    collection: collection
                }));
            });
        });

        /**
         * --- #config-edit-from/{workflowId} --- Create a config from a workflow,
         * persist it and show the config editor for it.
         */
        appRouter.route(/config-edit-from\/(.*)/, 'showConfigEditorFrom');
        appRouter.on('route:showConfigEditorFrom', function(fromWorkflowUri) {
            require([
                //                'views/workflow/RunWorkflowPage',
                'models/config/WorkflowConfigModel',
                'constants/RDFNS',
            ], function(WorkflowConfigModel, RDFNS) {
                if (!fromWorkflowUri) {
                    dialogs.errorNotFound();
                    return;
                }

                // Persist the workflow config
                var onGenerateSuccess = function(blankConfigData, status, xhr) {
                    var wf = RDFNS.rdf_attr('omnom:webservice', blankConfigData);
                    var wfLabel = RDFNS.rdf_attr('rdfs:label', wf);
                    RDFNS.rdf_attr("rdfs:label", blankConfigData, "Config for: " + wfLabel);
                    $.ajax({
                        async: false,
                        url: '/api/config',
                        type: "POST",
                        processData: false,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(blankConfigData),
                        success: function(namedConfigData, status, xhr) {
                            var respLocation = xhr.getResponseHeader("Location");
                            log.debug("Posted config to " + respLocation);
                            // Load the workflow config editor
                            appRouter.navigate("config-edit/" + respLocation, true);
                        },
                        error: onError,
                    });
                };

                var execUri = fromWorkflowUri.replace("/workflow/", "/exec/workflow/");
                execUri += "/blankConfig";
                // Let the server create an empty config for this workflow
                $.ajax({
                    url: execUri,
                    type: "GET",
                    dataType: "json",
                    async: false, // wait for result
                    success: onGenerateSuccess,
                    error: onError,
                });
            });
        });

        /**
         * --- #config-edit/{configId} --- Show the config editor
         */
        appRouter.route(/config-edit\/(.*)/, 'showConfigEditor');
        appRouter.on('route:showConfigEditor', function(configId) {
            log.debug("Hit route 'config-edit/" + configId);
            require([
                    'views/config/ConfigEditorPage',
                    'models/config/WorkflowConfigModel'
            ], function(ConfigEditorPage, WorkflowConfigModel) {
                if (!configId) {
                    dialogs.errorNotFound();
                } else {
                    var TheModel = WorkflowConfigModel.extend({
                        url: configId
                    });
                    var configModel = new TheModel();
                    configModel.fetch({
                        async: false
                    });
                    //                    console.warn(configModel);
                    var pageView = Vm.createView({}, 'ConfigEditorPage', ConfigEditorPage, {
                        model: configModel
                    });
                    appView.showPage(pageView);
                }
            });

        });

        /**
         * --- #job/{jobId} --- Show a single job
         */
        appRouter.route(/^job\/(.*)/, 'showJob');
        appRouter.on('route:showJob', function(jobId) {
            if (!jobId) {
                dialogs.errorNotFound();
                return;
            }
            require([
                    'models/job/JobModel',
                    'views/job/WorkflowJobPage'
            ], function(JobModel, JobPage) {
                $.ajax({
                    url: jobId,
                    dataType: "json",
                    complete: function(jqXHR, textStatus, err) {
                        if (jqXHR.status === 200) {
                            var jobData = $.parseJSON(jqXHR.responseText);
                            var jobInst = JobModel.findOrCreate(jobData);
                            jobInst.url = jobId;
                            var jobView = Vm.createView(this, 'JobPage', JobPage, {
                                model: jobInst
                            });
                            appView.showPage(jobView);
                        } else {
                            dialogs.errorXHR(jqXHR);
                        }
                    }
                });
            });
        });

        /**
         * TODO
         */
        appRouter.route(/^job-list/, 'showJobList');
        appRouter.on('route:showJobList', function() {
            require([
                    'models/job/JobModel',
                    'collections/job/JobCollection',
                    'views/job/JobListPage'
            ], function(JobModel, JobCollection, JobListPage) {
                var collection = new JobCollection();
                appView.showPage(Vm.createView({}, 'JobListPage', JobListPage, {
                    collection: collection
                }));
            });
        });

        /**
         * TODO
         */
        appRouter.route(/^config-list/, 'showConfigList');
        appRouter.on('route:showConfigList', function() {
            require([
                    'models/config/WorkflowConfigModel',
                    'collections/config/WorkflowConfigCollection',
                    'views/config/ConfigListPage'
            ], function(ConfigModel, ConfigCollection, ConfigListPage) {
                var configColl = new ConfigCollection();
                appView.showPage(Vm.createView({}, 'ConfigListPage', ConfigListPage, {
                    collection: configColl
                }));
            });
        });

        Backbone.history.start();

        return appRouter;
    };
    return {
        initialize: initialize
    };
});
