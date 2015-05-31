Typed.js
========

[View the live demo](http://www.mattboldt.com/demos/typed-js/) | [Go to my site, mattboldt.com](http://www.mattboldt.com)

Typed.js is a jQuery plugin that types. Enter in any string, and watch it type at the speed you've set, backspace what it's typed, and begin a new sentence for however many strings you've set.

---

Looking for some custom use cases for Typed.js? [Check out the wiki](https://github.com/mattboldt/typed.js/wiki)

---

Installation
------------
This is really all you need to get going.

~~~ javascript
<script src="jquery.js"></script>
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

<span class="element"></span>
~~~

### Install with Bower

~~~
bower install typed.js
~~~


Want the animated blinking cursor? Add this CSS.

~~~ scss
.typed-cursor{
	opacity: 1;
	-webkit-animation: blink 0.7s infinite;
	-moz-animation: blink 0.7s infinite;
	animation: blink 0.7s infinite;
}
@keyframes blink{
	0% { opacity:1; }
	50% { opacity:0; }
	100% { opacity:1; }
}
@-webkit-keyframes blink{
	0% { opacity:1; }
	50% { opacity:0; }
	100% { opacity:1; }
}
@-moz-keyframes blink{
	0% { opacity:1; }
	50% { opacity:0; }
	100% { opacity:1; }
}
~~~

### HTML tags

By default the content type is set to `html`, so you're good to go. Want to type out the html regularly? Set it to `text`.

~~~ javascript
$(".element").typed({
	strings: ["Typed.js is a <strong>jQuery</strong> plugin."],
	contentType: 'html' // or 'text'
});
~~~

### Line Breaks

#### `contentType: 'html'`

~~~ javascript
$(".typed").typed({ strings: ["Sentence with <br>line break."] });
~~~

#### `contentType: 'text'`

Use `white-space: pre` in your typed text element, and then `\n` when typing out the strings. Example:

~~~ html

<span id="typed" style="white-space:pre"></span>

...

$(".typed").typed({ strings: ["Sentence with a\nline break."] });

~~~

### Highlight, remove and type

You can make the plugin select all of the text then remove it before typing the second word. An example can be seen on https://safi.me.uk

It works best with text content instead of html as I have not figured a good way to select html tags.

(Credits: Tameem Safi)

~~~ javascript
<script>
    $(function(){
        $(".element").typed({
            // Enable highlight feature
            // Works best with contentType: 'text'
            strings: ["First sentence.", "Second sentence."],
            contentType: 'text',
            highlight: true,
        });
    });
</script>
~~~

### Type Pausing

You can pause in the middle of a string for a given amount of time by including an escape character.

~~~ javascript
<script>
	$(function(){
		$(".element").typed({
			// Waits 1000ms after typing "First"
			strings: ["First ^1000 sentence.", "Second sentence."]
		});
	});
</script>
~~~


Customization
----

~~~ javascript
<script>
	$(function(){
		$(".element").typed({
			strings: ["First sentence.", "Second sentence."],
			// typing speed
			typeSpeed: 0,
			// time before typing starts
			startDelay: 0,
			// backspacing speed
			backSpeed: 0,
			// time before backspacing
			backDelay: 500,
			// highlight instead of erasing each character (backspace effect)
			highlight: false,
			// loop
			loop: false,
			// false = infinite
			loopCount: false,
			// show cursor
			showCursor: true,
			// character for cursor
			cursorChar: "|",
			// attribute to type (null == text)
			attr: null,
			// either html or text
			contentType: 'html',
			// call when done callback function
			callback: function() {},
			// starting callback function before each string
			preStringTyped: function() {},
			//callback for every typed string
			onStringTyped: function() {},
			// callback for reset
			resetCallback: function() {}
		});
	});
</script>
~~~


### Get Super Custom

Want to get really custom? On my site and in the Typed.js demo I have the code type out two words, and then backspace only those two, then continue where it left off. This is done in an `if` statement in the `backspace()` function. Here's what it looks like.

~~~ javascript
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
~~~

This checks if the `arrayPos` is `1`, which would be the second string you entered. If so, it sets `stopNum` to `3` instead of `0`, which tells it to stop when there are 3 characters left. For now you'll have to create custom `if` statements for each specific case you want. I may automate this somehow in the future.


Wonderfull sites using Typed.js
---
http://allison.house/404

http://www.maxcdn.com/

https://commando.io/

http://testdouble.com/agency.html

http://www.stephanemartinw.com/

http://www.trelab.fi/en/

http://jessejohnson.github.io/

http://patrickelhage.com/

http://tairemadailey.com/

https://safi.me.uk


## Development

`npm install`

Then, once you've made your edits:

`gulp`

This will create a minified version in `/dist`


end
---

Thanks for checking this out. If you have any questions, I'll be on [Twitter](http://www.twitter.com/atmattb).

If you're using this, let me know! I'd love to see it.

It would also be great if you mentioned me or my website somewhere. [www.mattboldt.com](http://www.mattboldt.com)


