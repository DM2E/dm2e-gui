define(function(){

    return {
        /**
         * Returns the last segment of the argument interepreted as URL
         * last_url_segment("http://foo/bar/quux") = "quux"
         */
        last_url_segment: function (arg_url) {
            if (!arg_url) return "BLANK";
            return arg_url.replace(/.*\//, "");
        },
        /**
         * Returns the path part of the argument interpreted as URL
         * url_path("http://foo/bar/quux") = "/foo/bar/quux"
         */
        url_path: function (arg_url) {
            if (!arg_url) return "BLANK";
            return arg_url.replace(/http:\/\/[^\/]*/, "");
        },

    }

});