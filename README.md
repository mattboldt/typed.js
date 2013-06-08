Typed.js
========

[View the live demo](http://www.mattboldt.com/demos/typed-js/) | [Go to my site, mattboldt.com](http://www.mattboldt.com)

Typed.js is a jQuery plugin that types. Enter in any string, and watch it type at the speed you've set, backspace what it's typed, and begin a new sentence for however many strings you've set.

It can be used as a subtle animation on your website, a visual demo of a note taking application, or anything else you can think of.

Weighing in at only 6kb uncompressed, it's got a small footprint and doesn't slow down the rest of your site.

---

Installation
------------
This is really all you need to get going.

	<script src="typed.js"></script>
	<script>
  		$(function(){
      		$(".element").typed({
        		strings: ["First sentence.", "Second sentence."],
        		typeSpeed: 0
      		});
  		});
	</script>
	...

	<div class="element"></div>

Want the animated blinking cursor? Add this CSS.

	#typed-cursor{
  		opacity: 1;
  		font-weight: 100;
  		// add prefixes
  		animation: blink 0.7s infinite;
	}

	@-keyframes blink{
  		0% { opacity:1; }
  		50% { opacity:0; }
  		100% { opacity:1; }
	}
	
Customization
----	

	<script>
		$(function(){
      		$(".element").typed({
        		strings: ["First sentence.", "Second sentence."],
        		typeSpeed: 30, // typing speed
        		backDelay: 500, // pause before backspacing
        		callback: function(){ } // call function after typing is done
      		});
 		});
	</script>
	
Want to get really custom? On my site and in the Typed.js demo I have the code type out two words, and then backspace only those two, then continue where it left off. This is done in an `if` statement in the `backspace()` function. Here's what it looks like.

	...
	, backspace: function(curString, curStrPos){
		...

		setTimeout(function() {

				// check string array position
				// on the first string, only delete one word
				// the stopNum actually represents the amount of chars to
				// keep in the current string. In my case it's 3.
				if (self.arrayPos == 1){
					self.stopNum = 3;
				}
				//every other time, delete the whole typed string
				else{
					self.stopNum = 0;
				}
	...
	
This checks if the `arrayPos` is `1`, which would be the second string you entered. If so, it sets `stopNum` to `3` instead of `0`, which tells it to stop when there are 3 characters left. For now you'll have to create custom `if` statements for each specific case you want. I may automate this somehow in the future.

end
---

---
Thanks for checking this out. If you have any questions, I'll be on [Twitter](http://www.twitter.com/atmattb).

If you're using this, let me know! I'd love to see it.

It would also be great if you mentioned me or my website somewhere. [www.mattboldt.com](http://www.mattboldt.com)

	
