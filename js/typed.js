!function($){

	//"use strict";

	var Typed = function(el, options){

		// for variable scope's sake
		self = this;

		// chosen element to manipulate text
		self.el = $(el);
		// options
		self.options = $.extend({}, $.fn.typed.defaults, options);

		// text content of element
		self.text = self.el.text();

		// typing speed
		self.typeSpeed = self.options.typeSpeed;

		// amount of time to wait before backspacing
		self.backDelay = self.options.backDelay;

		// input strings of text
		self.strings = self.options.strings;

		// character number position of current string
		self.strPos = 0;

		// current array position
		self.arrayPos = 0;

		// current string based on current values[] array position 
		self.string = self.strings[self.arrayPos];

		// number to stop backspacing on.
		// default 0, can change depending on how many chars
		// you want to remove at the time
		self.stopNum = 0;

		// number in which to stop going through array
		// set to strings[] array (length - 1) to stop deleting after last string is typed
		self.stopArray = self.strings.length-1;

		// All systems go!
		self.init();
	}

		Typed.prototype =  {

			constructor: Typed
			
			, init: function(){
				// begin the loop w/ first current string (global self.string)
				// current string will be passed as an argument each time after this
				self.typewrite(self.string, self.strPos);
				self.el.after("<span id=\"typed-cursor\">|</span>");
			}

			// pass current string state to each function
			, typewrite: function(curString, curStrPos){

				// varying values for setTimeout during typing
				// can't be global since number changes each time loop is executed
				var humanize = Math.round(Math.random() * (100 - 30)) + self.typeSpeed;

				// ------ optional ------ //
				// custom backspace delay
				//if (self.arrayPos == 0){
				//    self.backDelay = 4000;
				//}
				//else{ self.backDelay = 1000; }

				// containg entire typing function in a timeout
				setTimeout(function() {

					// make sure array position is less than array length
					if (self.arrayPos < self.strings.length){
						
						// start typing each new char into existing string
						// curString is function arg
						self.el.text(self.text + curString.substr(0, curStrPos));

						// check if current character number is the string's length
						// and if the current array position is less than the stopping point
						// if so, backspace after backDelay setting
						if (curStrPos > curString.length && self.arrayPos < self.stopArray){
							clearTimeout(clear);
							var clear = setTimeout(function(){
								self.backspace(curString, curStrPos);
							}, self.backDelay);
						}

						// else, keep typing
						else {
							// add characters one by one
							curStrPos++;
							// loop the function
							self.typewrite(curString, curStrPos);
							// if the array position is at the stopping position
							// finish code, on to next task
							if (self.arrayPos == self.stopArray && curStrPos == curString.length){
								// animation that occurs on the last typed string
								// place any finishing code here
								var clear = self.options.callback();
								clearTimeout(clear);
							}
						}
					}

				// humanized value for typing
				}, humanize);
			
			}

			, backspace: function(curString, curStrPos){

				// varying values for setTimeout during typing
				// can't be global since number changes each time loop is executed
				var humanize = Math.round(Math.random() * (100 - 30)) + self.typeSpeed;

				setTimeout(function() {

					// ----- this part is optional ----- //
						// check string array position
						// on the first string, only delete one word
						// the stopNum actually represents the amount of chars to
						// keep in the current string. In my case it's 14.						
						// if (self.arrayPos == 0) {
						//     self.stopNum = 11;
						// }
						// else if (self.arrayPos == 1) {
						//     self.stopNum = 11;
						// }
						//every other time, delete the whole typed string
						// else {
						//     self.stopNum = 0;
						// }

					// ----- continue important stuff ----- //
						// replace text with current text + typed characters
						self.el.text(self.text + curString.substr(0, curStrPos));

						// if the number (id of character in current string) is 
						// less than the stop number, keep going
						if (curStrPos > self.stopNum){
							// subtract characters one by one
							curStrPos--;
							// loop the function
							self.backspace(curString, curStrPos);
						}
						// if the stop number has been reached, increase 
						// array position to next string
						else if (curStrPos <= self.stopNum){
							clearTimeout(clear);
							var clear = self.arrayPos = self.arrayPos+1;
							// must pass new array position in this instance
							// instead of using global arrayPos
							self.typewrite(self.strings[self.arrayPos], curStrPos);
						}

				// humanized value for typing
				}, humanize);	

			}

		}

	$.fn.typed = function (option) {
	    return this.each(function () {
	      var $this = $(this)
	        , data = $this.data('typed')
	        , options = typeof option == 'object' && option
	      if (!data) $this.data('typed', (data = new Typed(this, options)))
	      if (typeof option == 'string') data[option]()
	    });
	}

	$.fn.typed.defaults = {
		strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
		// typing and backspacing speed
		typeSpeed: 0,
		// time before backspacing
		backDelay: 500,
		// ending callback function
		callback: function(){ null }
	}


}(window.jQuery);
	


	

