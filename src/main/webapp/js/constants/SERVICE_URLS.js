define(function() {
    var protocol =  window.location.protocol
    var host = protocol + "//"
            + window.location.hostname
            + (window.location.port !== 80 ? ":" +  window.location.port : "")
    var baseURL = host + window.location.pathname + "api/";
    return {
        PROTOCOL : protocol,
        HOST: host,
        BASE : baseURL,

        userService :  baseURL + "user/",
        workflowService : baseURL + "workflow/",
        configService :  baseURL + "config/",
    };
});
