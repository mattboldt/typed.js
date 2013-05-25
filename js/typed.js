$(function(){

	var Typed = function(el, values){
		// for variable scope's sake
		self = this;

		// chosen element to manipulate text
		self.el = $(el);

		// text content of element
		self.text = self.el.text();

		// varying values for setTimeout during typing
		self.humanize = Math.round(Math.random() * (100 - 30)) + 30;

		// amount of time to wait before backspacing
		self.backDelay = 500;

		if (!values){
			// custom typed values
			self.values = ["These are...", "default values.", "Use your own!", "Have a great day!"];
		}
		else{
			self.values = values;
		}

		// character number position of current string
		self.strPos = 0;

		// current array position
		self.arrayPos = 0;

		// current string based on current values[] array position 
		self.string = self.values[self.arrayPos];

		// number to stop backspacing on.
		// default 0, can change depending on how many chars
		// you want to remove at the time
		self.stopNum = 0;

		// number in which to stop going through array
		// set to values[] array (length - 1) to stop deleting after last string is typed
		self.stopArray = self.values.length-1;

		// All systems go!
		self.init();
	}

		Typed.prototype =  {

			constructor: Typed
			
			, init: function(){
				// begin the loop w/ first current string (global self.string)
				// current string will be passed as an argument each time after this
				self.typewrite(self.string, self.strPos);
			}

			// pass current string state to each function
			, typewrite: function(curString, curStrPos){

				// containg entire typing function in a timeout
				setTimeout(function() {

					// make sure array position is less than array length
					if (self.arrayPos < self.values.length){
						
						// start typing each new char into existing string
						// curString is function arg
						self.el.text(self.text + curString.substr(0, curStrPos));

						// check if current character number is the string's length
						// and if the current array position is less than the stopping point
						// if so, backspace after backDelay setting
						if (curStrPos > curString.length && self.arrayPos < self.stopArray){
							clearTimeout();
							setTimeout(function(){
								self.backspace(curString, curStrPos);
							}, self.backDelay);
						}

						// else, keep typing
						else{
							// add characters one by one
							curStrPos++;
							// loop the function
							self.typewrite(curString, curStrPos);
							// if the array position is at the stopping position
							// finish code, on to next task
							if (self.arrayPos == self.stopArray){
								// animation that occurs on the last typed string
								// place any finishing code here
								clearTimeout();
							}
						}
					}

				// humanized value for typing
				}, self.humanize);
			
			}

			, backspace: function(curString, curStrPos){

				setTimeout(function() {

					// ----- this part is optional ----- //
						// check string array position
						// on the first string, only delete one word
						// the stopNum actually represents the amount of chars to
						// keep in the current string. In my case it's 5.
						//if (self.arrayPos == 0){
						//	self.stopNum = 0;
						//}
						// every other time, delete the whole typed string
						//else{
						//	self.stopNum = 0;
						//}

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
							clearTimeout();
							self.arrayPos = self.arrayPos+1;
							// must pass new array position in this instance
							// instead of using global arrayPos
							self.typewrite(self.values[self.arrayPos], curStrPos);
						}

				// humanized value for typing
				}, self.humanize);	

			}

		}

	// -------------------------------------------------------- //
	// ----- very optional localstorage setting to check if --- // 
	// ----- the user has seen your awesome animation yet ----- //
	// ----- and disable it in case it's annoying ------------- //
	// -------------------------------------------------------- //
	// if( localStorage.getItem("mb-animated-state") !== "true" ){ 
	// 	
	// 	localStorage.setItem("mb-animated-state", "true" );
	// }
	// else{
	// 	$("#typed").text("Matt.");
	// 	Typed.prototype.lift();
	// }
	// $(window).unload(function() {
	//   localStorage.removeItem("mb-animated-state");
	// });
	
	// -------------------------------------------------------- //
	// ------------------- Go forth and type! ----------------- //
	// -------------------------------------------------------- //
	// ---- be sure to use an empty element for typed text ---- //
	// -------------------------------------------------------- //
	new Typed("#typed");



});

