<img src="/logo-cropped.png" width="450px" title="Typed.js" />
========

[View the live demo](http://www.mattboldt.com/demos/typed-js/) | [Go to my site, mattboldt.com](http://www.mattboldt.com)

Typed.js is a library that types. Enter in any string, and watch it type at the speed you've set, backspace what it's typed, and begin a new sentence for however many strings you've set.

Looking for some custom use cases for Typed.js? [Check out the wiki](https://github.com/mattboldt/typed.js/wiki)

---

Installation
------------
This is really all you need to get going.

~~~ javascript
<script src="typed.js"></script>
<script>
	document.addEventListener("DOMContentLoaded", function(){
		Typed.new(".element", {
			strings: ["First sentence.", "Second sentence."],
			typeSpeed: 0
		});
	});
</script>
...

<span class="element"></span>
~~~

Or you can use jQuery:

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

Wonderful sites using Typed.js
---
https://slack.com/

https://envato.com/

https://productmap.co/

https://www.typed.com/

https://git.market/

http://allison.house/404

http://www.maxcdn.com/

https://commando.io/

http://testdouble.com/agency.html

http://www.stephanemartinw.com/

http://www.trelab.fi/en/

http://jessejohnson.github.io/


---

### HTML tags

By default the content type is set to `html`, so you're good to go. Want to type out the html regularly? Set it to `text`.

~~~ javascript
Typed.new(".element", {
	strings: ["Typed.js is an <strong>Awesome</strong> library."],
	contentType: 'html' // or 'text'
});
~~~

### Strings from static HTML (SEO Friendly)
Rather than using the `strings` array to insert strings, you can place an HTML `div` on the page and read from it.
This allows bots and search engines, as well as users with JavaScript disabled, to see your text on the page.

~~~ javascript
<script>
	document.addEventListener('DOMContentLoaded', function(){
		Typed.new('#typed', {
			stringsElement: document.getElementById('typed-strings')
		});
	});
</script>
~~~
You must wrap each string in the `typed-strings` div with a `<p>`
~~~ html
<div id="typed-strings">
    <p>Typed.js is an <strong>Awesome</strong> library.</p>
    <p>It <em>types</em> out sentences.</p>
</div>
<span id="typed"></span>
~~~

### Line Breaks

#### `contentType: 'html'`

~~~ javascript
Typed.new(".typed", { strings: ["Sentence with <br>line break."] });
~~~

#### `contentType: 'text'`

Use `white-space: pre` in your typed text element, and then `\n` when typing out the strings. Example:

~~~ html

<span id="typed" style="white-space:pre"></span>

...

Typed.new(".element", { strings: ["Sentence with a\nline break."] });

~~~

### Type Pausing

You can pause in the middle of a string for a given amount of time by including an escape character.

~~~ javascript
Typed.new(".element", {
	// Waits 1000ms after typing "First"
	strings: ["First ^1000 sentence.", "Second sentence."]
});
~~~


Customization
----

~~~ javascript
Typed.new(".element", {
	strings: ["First sentence.", "Second sentence."],
	// Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
	stringsElement: null,
	// typing speed
	typeSpeed: 0,
	// time before typing starts
	startDelay: 0,
	// backspacing speed
	backSpeed: 0,
	// shuffle the strings
	shuffle: false,
	// time before backspacing
	backDelay: 500,
	// loop
	loop: false,
	// null = infinite
	loopCount: null,
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


