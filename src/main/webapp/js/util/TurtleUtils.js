define(['constants/RDFNS'], function(NS) {
    return {
        toTurtle : function(obj) {
            var turtleOut;
            var objID;
            if (obj.id) {
                objID = "<" + obj.id + ">";
            } else {
                objID = "[]";
            }
            turtleOut = objID + " ";
            // TODO
//            if (NS.rdf_attr(obj, "rdf:type")) {
//                turtleOut += "a " + NS.rdf_attr(obj, "rdf:type")) + ";
//            }

        }
    };
});
