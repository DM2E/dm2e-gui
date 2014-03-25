define([
    'jquery',
    'underscore',
    'logging',
    'vm',
    'constants/RDFNS',
    'BaseView',
    'util/UriUtils',
    'text!templates/job/assignmentTableRowTemplate.html'
], function($,
    _,
    logging,
    Vm,
    RDFNS,
    BaseView,
    UriUtils,
    theTemplate
 ) {
    var log = logging.getLogger("views.job.AssignmentTableRowView");

    return BaseView.extend({

        tagName: 'tr',

        template: theTemplate,

        renderActions : function() {
          var parameterValue = RDFNS.rdf_attr("omnom:parameterValue", this.model.toJSON());
          // if it's a link to a dataset display it
          if (parameterValue.substring(0, 19) === "http://data.dm2e.eu") {
              this.$("div.assignment-actions").append($("<a></a>")
                                                      .addClass("btn btn-success btn-small")
                                                      .attr("href", parameterValue)
                                                      .append("Show in Pubby"))
                                                          ;
          } else if (parameterValue.substring(0, 7) === "http://") {
              this.$("div.assignment-actions").append($("<a></a>")
                                                      .addClass("btn btn-small")
                                                      .attr("href", parameterValue)
                                                      .append("Open link"));
          }
        },

        render: function() {
          this.renderModel();
          this.renderActions();
          this.$el.attr("data-forParam", UriUtils.last_url_segment(this.model.getQN("omnom:forParam").id));
          return this;
        },


    });
 });
