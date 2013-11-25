define([
    'underscore',
    'BaseModel',
], function(_, BaseModel) {

    var FileModel = BaseModel.extend({

        // defaults : {
        //     originalName : "Untitled Document :)",
        //     fileType : "http://onto.dm2e.eu/omnom-types/Unknown",
        // },

        parse : function(response, options) {
            // Reduce ID to the last path segment, so DELETE, PUT etc. in
            // collections work
            // console.log(response);
            if (response.members) {
                response  = response.members;
            }
            // response.id = response.id.replace(/http.*\//, "");
            return response;
        },

        // All our IDs are dereferenceable URLs, don't take colleciton into account
        // (which points to non-RESTful URI /{resource}/list :( )
        url : function() {
            return this.id;
        },


    });

    return FileModel;

});
