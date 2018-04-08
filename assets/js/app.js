
require("./helpers.js"); 
require("jquery.cookie");
(require("jquery-touch-events"))();   

var $ = require("jquery"),  
    _ = require("underscore"), 
    busEvent = require("./busEvent.js");   


window.DB  = DB ;
 

(function init(root) {  
	
	var _initListners = function() {   
		var self = this; 
		
	},
	_initViewPort = function() {
		$("body").css({"min-height": window.innerHeight});
	};

	function App(conf) {
		$.cookie.json = true;
		

		_initListners.apply(this);
		_initViewPort();
	}



	

	root.App = new App();

})(window)

