define([
    'jquery',
    'underscore',
    'logging',
    'vm',
    'constants/RDFNS',
    'BaseView',
    'text!templates/job/assignmentTableRowTemplate.html'
], function($,
    _,
    logging,
    Vm,
    RDFNS,
    BaseView,
    theTemplate
 ) {
    var log = logging.getLogger("views.job.AssignmentTableRowView");

    return BaseView.extend({

        tagName: 'tr',

        template: theTemplate,

        renderActions : function() {
          var parameterValue = RDFNS.rdf_attr("omnom:parameterValue", this.model.toJSON());
          if (parameterValue.substring(0, 7) === "http://") {
            this.$("div.assignment-actions").append($("<a></a>")
                  .addClass("btn")
                  .attr("href", parameterValue)
                  .append("Open link"));
          }
          // if it's a link to a dataset display it
          if (parameterValue.substring(0, 19) === "http://data.dm2e.eu") {
            this.$("div.assignment-actions").append($("<a></a>")
                  .addClass("btn btn-success")
                  .attr("href", parameterValue.replace(
                                          /http:\/\/data.dm2e.eu\/data/, 
                                          'http://lelystad.informatik.uni-mannheim.de:3000/data/ingested'))
                  .append("Show in Pubby"))
                  ;
          }
        },

        render: function() {
          this.renderModel();
          this.renderActions();
          return this;
        },


    });
 });
