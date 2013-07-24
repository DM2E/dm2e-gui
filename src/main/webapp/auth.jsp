<%@ page contentType="application/json" language="java" %>
<% assert(request.getUserPrincipal() != null); %>
{"username":"<%=request.getUserPrincipal().getName()%>"}
