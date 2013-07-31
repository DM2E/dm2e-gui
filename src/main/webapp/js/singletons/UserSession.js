define(['singletons/UserSessionBuilder'], function(UserSessionBuilder) {
    session = UserSessionBuilder.prototype.initSession();
    return session;
});
