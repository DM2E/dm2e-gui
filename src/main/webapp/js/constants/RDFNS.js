define([
    'jquery',
    'underscore',
    'logging',
    'util/constantLoader'
], function ($, _, logging, loadConstants) {

    var rdfns = {};

    var rdfnsRaw = loadConstants.from('api/constants/rdfns');
    _.each(rdfnsRaw, function (urls, namespace) {
        var urlsNameReverse = {};
        _.each(urls, function (url, name) {
            // OMNOM().PROP_FOO()
            urls[name] = function () {
                return url;
            };
            var pathSegment = url.replace(urls.BASE(), "");
            urlsNameReverse[pathSegment] = name;
        });
        urls._inverted = urlsNameReverse;
        urls._expand = function (path) {
            var constantName = this._inverted[path];
            if (!constantName) {
                console.log(this._inverted);
                throw "Unknown path " + path;
            }
            return this[constantName].call();
        };
        var rdfnsElem = function () {
            return urls;
        };
        rdfns[namespace] = rdfnsElem;

    });

    rdfns.expand = function (qname) {
        var tokens = qname.split(":");
        var namespace = tokens[0].toUpperCase();
        var path = tokens[1];
        if (!this[namespace]) {
            throw "Unknown namespace prefix " + namespace;
        }
        return this[namespace].call()._expand(path);
    };

    /**
     * Get/Set the key of an object by a qname
     */
    rdfns.rdf_attr = function (qname, arg_obj, arg_val) {
        if (typeof arg_obj === 'undefined')
            throw "Must give object to rdf_attr";
        if (typeof arg_val !== 'undefined')
            arg_obj[rdfns.expand(qname)] = arg_val;
        return arg_obj[rdfns.expand(qname)];
    };
//	console.log(rdfns.OMNOM().PROP_FILE_RETRIEVAL_URI());
//	console.log(rdfns.OMNOM().qname("fileRetrievalURI"));
//	console.log(rdfns.get("omnom:fileRetrievalURI"));
    return rdfns;
});
