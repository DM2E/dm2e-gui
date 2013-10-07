define([
    'underscore',
    'BaseCollection',
    'logging',
    'constants/RDFNS',
    'models/workflow/WebserviceModel',
], function(_, BaseCollection, logging, RDFNS, WebserviceModel) {

    var log = logging.getLogger("WebserviceModel");

    var WebserviceCollection = BaseCollection.extend({

        model : WebserviceModel,

        comparator : RDFNS.expand('rdfs:label'),
        
//      initialize : function(models, options) {
//          options = options || {};
//          if (options.url) {
//              this.url = function() {
//                  return options.url;
//              };
//          }
//      },
        
//       url : function() {
//       return 'api/file/list';
//       },

//      parse : function(data) {
//          log.debug("Parsing list of files.");
//          // console.log(data);
//          return data;
//      },

//      listAvailable : function() {
//          return this.where({fileStatus : FILESTATUS.AVAILABLE});
//      }

    });

    return WebserviceCollection;

});
