define(function() {
    var protocol =  window.location.protocol;
    var host = protocol +
        "//" +
        window.location.hostname +
        (window.location.port !== 80 ? ":" +  window.location.port : "");
    var path_without_file = window.location.pathname.replace(/[^\/]+$/, "");
    var baseURL = host + path_without_file + "api/";
    return {
        PROTOCOL : protocol,
        HOST: host,
        BASE : baseURL,

        userService :  baseURL + "user/",
        workflowService : baseURL + "workflow/",
        configService :  baseURL + "config/",
    };
});
