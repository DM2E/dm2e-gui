/**
* @module util/themeSwitcher 
* */
define(
    [
        'jquery'
    ],
    function ($) {

        var currentState;
        var themes = {
            light : "css/theme-light.css",
            dark : "css/theme-dark.css",
        };
        /**
         * Toggles between light and dark theme
         */
        var toggleState = function () {
            currentState = currentState == 'light' ? 'dark' : 'light';
        };
        /**
         * Sets the current theme by replacing the <link> element in <head> accordingly
         */
        var applyTheme = function() {
            $("body").hide();
            $("*[data-theme]").remove();
            $("head").append(
                $("<link/>")
                    .attr("data-theme", "true")
                    .attr("rel", "stylesheet")
                    .attr("type", "text/css")
                    .attr("href", themes[currentState]));
            $("body").show();
        };
        var getTheme = function() {
            return currentState;
        };
        var setTheme = function(name) {
            currentState = name === 'dark' ? 'dark' : 'light';
            applyTheme();
        };
        var toggle = function () {
            toggleState();
            applyTheme();
        };
        return {

            /**
             * Toggle the current theme and switch to the new one
             * @instance
             */
            toggle: toggle,

            /**
             * Set the current theme
             * @instance
             */
            setTheme: setTheme,

            /**
             * Get the current theme
             * @instance
             */
            getTheme: getTheme,
        };
    });
