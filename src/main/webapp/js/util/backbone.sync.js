/**
 * Custom wrapper for backbone sync to accomodate our ID = URL pragma
 * @module util/backbone-sync
 */
require([
        'underscore',
        'backbone',
        'logging',
], function(
    _,
    Backbone,
    logging
) {
    var log = logging.getLogger("backbone.sync");
    var originalBackboneSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {

        try {
            _.result(model, 'url');
        } catch(e) {
            log.trace(e.toString());
            if (typeof model.id !== 'undefined') {
                log.debug("Shimmying url " + model.id);
                model.url = model.id;
            } else {
                log.error(e);
                throw e;
            }
        }

        log.debug(method + " " + model.url);
        var request = originalBackboneSync.call(Backbone, method, model, options);

        request.always(function(jqXHR, textStatus, err) {
            console.log(method, textStatus);
        });
        return request;
    };
});

