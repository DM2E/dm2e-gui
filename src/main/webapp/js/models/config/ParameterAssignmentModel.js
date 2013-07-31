//Filename: ParameterAssignmentModel.js

define([
    'jquery',
    'underscore',
    'logging',
    'constants/RDFNS',
    'RelationalModel',
], function ($, _, logging, NS, RelationalModel) {

    var log = logging.getLogger("ParameterAssignmentModel");

    var theDefaults = {};
    NS.rdf_attr("rdf:type", theDefaults, NS.expand("omnom:ParameterAssignment"));

    return RelationalModel.extend({

        defaults: theDefaults,

        initialize: function () {
            log.debug("Initialized ParameterAssignmentModel");
        }

    });
});
