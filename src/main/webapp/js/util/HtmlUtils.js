/**
 * @module util.HtmlUtils
 */
define([], function() {
  /**
   * Escapes angle brackets and ampersands
   */
  return {
    html_escape: function(raw) {
      var ret = raw || "";
      ret = ret.replace(/&/g, "&amp;");
      ret = ret.replace(/</g, "&lt;");
      ret = ret.replace(/>/g, "&gt;");
      return ret;
    }
  };
});
