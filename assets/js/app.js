
require("./helpers.js"); 
require("jquery.cookie");

(require("jquery-touch-events"))();



var $ = require("jquery"),  
    _ = require("underscore"), 
    busEvent = require("./busEvent.js");   


(function init(root) {  
	
	var _initListners = function() {   
		var self = this; 

		$("#swipe-place").on("dblclick", function(){
			if($(this).hasClass("_blackSkin")) {
				$(this).removeClass("_blackSkin").addClass("_whiteSkin");
			} else {
				$(this).addClass("_blackSkin").removeClass("_whiteSkin");
			}
		});
		$("#swipe-place").on("hold", function(){
			if($(this).hasClass("_blackSkin")) {
				$(this).removeClass("_blackSkin").addClass("_whiteSkin");
			} else {
				$(this).addClass("_blackSkin").removeClass("_whiteSkin");
			}
		});




		$("#swipe-place").on("swipeup", function(){
			console.log("swipeUp")
			self.checkExample('plus');
			self.nextExample();
		});


		$("#swipe-place").on("swipedown", function(){
			console.log("swipeDown");
			self.checkExample('minus');
			self.nextExample();
		});

		$("#start-game").on("click", function(){
			self.startGame();
			$(this).hide();
		})
		
	},
	_initViewPort = function() {
		$("body").css({"min-height": window.innerHeight});
	};

	function App(conf) {
		$.cookie.json = true;



		Object.defineProperty(this, "op1", {
            get: function() {
                return parseInt($("#op1").html());
            },

            set: function(value) {
            	$("#op1").html(value);
            }
        }); 


		Object.defineProperty(this, "op2", {
            get: function() {
                return parseInt($("#op2").html());
            },

            set: function(value) {
            	$("#op2").html(value);
            }
        }); 


		Object.defineProperty(this, "result", {
            get: function() {
                return parseInt($("#result").html());
            },

            set: function(value) {
            	$("#result").html(value);
            }
        }); 

		this.time = 60;
		this.countSuccess = 0;
		//this.nextExample();

		_initListners.apply(this);
		_initViewPort();
	}

	App.prototype.startGame = function() {
		var self = this;
		this.time = 60;
		this.nextExample();
		this.interval = setInterval(function(){
			self.time -=1;
			if(self.time < 0) {
				alert("Ваш результат: " + self.countSuccess);
				self.stopGame();
			}
		},1000);
	}
	App.prototype.stopGame = function() {
		clearInterval(this.interval);
		$("#start-game").show();
	}

	App.prototype.getRandomNumber = function(N) {
		return Math.ceil((Math.random()*1000))%N;
	}


	App.prototype.nextExample = function() {
		if(this.getRandomNumber(2)) {
			this.op1 = this.getRandomNumber(7);
			this.op2 = this.getRandomNumber(7);
			this.result = this.op1 + this.op2;
		} else {
			var op1 = this.getRandomNumber(15);
			var op2 = this.getRandomNumber(15);
			if(op1 > op2) {
				this.op1 = op1;
				this.op2 = op2;
			} else {
				this.op1 = op2;
				this.op2 = op1;
			}
			this.result = this.op1 - this.op2;
		}
	}

	App.prototype.checkExample = function(sign) {
		if(sign == "plus" && this.op1 + this.op2 == this.result) {
			this.countSuccess +=1;
		} 
		if(sign == "minus" && this.op1 - this.op2 == this.result) {
			this.countSuccess +=1;
		} 
	}

	

	root.App = new App();

})(window)

