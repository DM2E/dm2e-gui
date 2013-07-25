define(function() {
	return {
		human_readable_size: function(origSize) {
			var size = origSize;
			var units = ['B', 'KB', 'MB', 'GB'];
			var i = 0;
			while (i < units.length) {
				if (size < 1024) {
					break;
				}
				size /= 1024;
				i++;
			}
			var asStr = size + " " + units[i];
			return asStr.replace(/(\.\d\d)[^\s]+/, function(match, $1) {
				return $1;
			});
		}
	};
});