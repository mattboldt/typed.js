/*!
 * 
 *   typed.js - A jQuery typing animation script
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v1.1.7
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash"], factory);
	else if(typeof exports === 'object')
		exports["Typed"] = factory(require("lodash"));
	else
		root["Typed"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _lodash = __webpack_require__(1);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _defaultsJs = __webpack_require__(2);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    _classCallCheck(this, Typed);
	
	    var self = this;
	
	    // chosen element to manipulate text
	    this.el = document.getElementById(elementId);
	
	    // options
	    this.options = {};
	    Object.keys(_defaultsJs2['default']).forEach(function (key) {
	      self.options[key] = _defaultsJs2['default'][key];
	    });
	    Object.keys(options).forEach(function (key) {
	      self.options[key] = options[key];
	    });
	
	    // attribute to type into
	    this.isInput = this.el.tagName.toLowerCase() === 'input';
	    this.attr = this.options.attr;
	
	    // show cursor
	    this.showCursor = this.isInput ? false : this.options.showCursor;
	
	    // text content of element
	    this.elContent = this.attr ? this.el.getAttribute(this.attr) : this.el.textContent;
	
	    // html or plain text
	    this.contentType = this.options.contentType;
	
	    // typing speed
	    this.typeSpeed = this.options.typeSpeed;
	
	    // add a delay before typing starts
	    this.startDelay = this.options.startDelay;
	
	    // backspacing speed
	    this.backSpeed = this.options.backSpeed;
	
	    // amount of time to wait before backspacing
	    this.backDelay = this.options.backDelay;
	
	    // Fade out instead of backspace
	    this.fadeOut = this.options.fadeOut;
	    this.fadeOutClass = this.options.fadeOutClass;
	    this.fadeOutDelay = this.options.fadeOutDelay;
	
	    // div containing strings
	    this.stringsElement = document.getElementById(this.options.stringsElement);
	
	    // input strings of text
	    this.strings = this.options.strings;
	
	    // character number position of current string
	    this.strPos = 0;
	
	    // current array position
	    this.arrayPos = 0;
	
	    // number to stop backspacing on.
	    // default 0, can change depending on how many chars
	    // you want to remove at the time
	    this.stopNum = 0;
	
	    // Looping logic
	    this.loop = this.options.loop;
	    this.loopCount = this.options.loopCount;
	    this.curLoop = 0;
	
	    // for stopping
	    this.stop = false;
	
	    // custom cursor
	    this.cursorChar = this.options.cursorChar;
	
	    // shuffle the strings
	    this.shuffle = this.options.shuffle;
	    // the order of strings
	    this.sequence = [];
	
	    // All systems go!
	    this.build();
	  }
	
	  // Typed.new = function(selector, option) {
	  //   var elements = Array.prototype.slice.apply(document.querySelectorAll(selector));
	  //   elements.forEach(function(element) {
	  //     var instance = element._typed,
	  //         options = typeof option == 'object' && option;
	  //     if (instance) { instance.reset(); }
	  //     element._typed = instance = new Typed(element, options);
	  //     if (typeof option == 'string') instance[option]();
	  //   });
	  // };
	
	  _createClass(Typed, [{
	    key: 'init',
	    value: function init() {
	      // begin the loop w/ first current string (global self.strings)
	      // current string will be passed as an argument each time after this
	      var self = this;
	      self.timeout = setTimeout(function () {
	        for (var i = 0; i < self.strings.length; ++i) self.sequence[i] = i;
	
	        // shuffle the array if true
	        if (self.shuffle) self.sequence = self.shuffleArray(self.sequence);
	
	        var elContent;
	        if (self.isInput) {
	          elContent = self.el.value;
	        } else if (self.contentType === 'html') {
	          elContent = self.el.innerHTML;
	        } else {
	          elContent = self.el.textContent;
	        }
	        // Start typing
	        // Check if there is some text in the element, if yes start by backspacing the default message
	        if (elContent.length == 0) {
	          self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
	        } else {
	          self.backspace(elContent, elContent.length);
	        }
	      }, self.startDelay);
	    }
	  }, {
	    key: 'build',
	    value: function build() {
	      var self = this;
	      // Insert cursor
	      if (this.showCursor === true) {
	        this.cursor = document.createElement('span');
	        this.cursor.className = 'typed-cursor';
	        this.cursor.innerHTML = this.cursorChar;
	        this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
	      }
	      if (this.stringsElement) {
	        this.strings = [];
	        this.stringsElement.style.display = 'none';
	        var strings = Array.prototype.slice.apply(this.stringsElement.children);
	        strings.forEach(function (stringElement) {
	          self.strings.push(stringElement.innerHTML);
	        });
	      }
	      this.init();
	    }
	
	    // pass current string state to each function, types 1 char per call
	  }, {
	    key: 'typewrite',
	    value: function typewrite(curString, curStrPos) {
	      // exit when stopped
	      if (this.stop === true) {
	        return;
	      }
	
	      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
	        this.el.classList.remove(this.fadeOutClass);
	        this.cursor.classList.remove(this.fadeOutClass);
	      }
	
	      // varying values for setTimeout during typing
	      // can't be global since number changes each time loop is executed
	      var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
	      var self = this;
	
	      // ------------- optional ------------- //
	      // backpaces a certain string faster
	      // ------------------------------------ //
	      // if (self.arrayPos == 1){
	      //  self.backDelay = 50;
	      // }
	      // else{ self.backDelay = 500; }
	
	      // contain typing function in a timeout humanize'd delay
	      self.timeout = setTimeout(function () {
	        // check for an escape character before a pause value
	        // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
	        // single ^ are removed from string
	        var charPause = 0;
	        var substr = curString.substr(curStrPos);
	        if (substr.charAt(0) === '^') {
	          var skip = 1; // skip atleast 1
	          if (/^\^\d+/.test(substr)) {
	            substr = /\d+/.exec(substr)[0];
	            skip += substr.length;
	            charPause = parseInt(substr);
	          }
	
	          // strip out the escape character and pause value so they're not printed
	          curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
	        }
	
	        if (self.contentType === 'html') {
	          // skip over html tags while typing
	          var curChar = curString.substr(curStrPos).charAt(0);
	          if (curChar === '<' || curChar === '&') {
	            var tag = '';
	            var endTag = '';
	            if (curChar === '<') {
	              endTag = '>';
	            } else {
	              endTag = ';';
	            }
	            while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
	              tag += curString.substr(curStrPos).charAt(0);
	              curStrPos++;
	              if (curStrPos + 1 > curString.length) {
	                break;
	              }
	            }
	            curStrPos++;
	            tag += endTag;
	          }
	        }
	
	        // timeout for any pause after a character
	        self.timeout = setTimeout(function () {
	          if (curStrPos === curString.length) {
	            // fires callback function
	            self.options.onStringTyped(self.arrayPos);
	
	            // is this the final string
	            if (self.arrayPos === self.strings.length - 1) {
	              // animation that occurs on the last typed string
	              self.options.callback();
	
	              self.curLoop++;
	
	              // quit if we wont loop back
	              if (self.loop === false || self.curLoop === self.loopCount) return;
	            }
	
	            self.timeout = setTimeout(function () {
	              self.backspace(curString, curStrPos);
	            }, self.backDelay);
	          } else {
	
	            /* call before functions if applicable */
	            if (curStrPos === 0) {
	              self.options.preStringTyped(self.arrayPos);
	            }
	
	            // start typing each new char into existing string
	            // curString: arg, self.el.html: original text inside element
	            var nextString = curString.substr(0, curStrPos + 1);
	            if (self.attr) {
	              self.el.setAttribute(self.attr, nextString);
	            } else {
	              if (self.isInput) {
	                self.el.value = nextString;
	              } else if (self.contentType === 'html') {
	                self.el.innerHTML = nextString;
	              } else {
	                self.el.textContent = nextString;
	              }
	            }
	
	            // add characters one by one
	            curStrPos++;
	            // loop the function
	            self.typewrite(curString, curStrPos);
	          }
	          // end of character pause
	        }, charPause);
	
	        // humanized value for typing
	      }, humanize);
	    }
	  }, {
	    key: 'backspace',
	    value: function backspace(curString, curStrPos) {
	      var self = this;
	      // exit when stopped
	      if (this.stop === true) {
	        return;
	      }
	
	      if (this.fadeOut) {
	        this.initFadeOut();
	        return;
	      }
	
	      // varying values for setTimeout during typing
	      // can't be global since number changes each time loop is executed
	      var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
	
	      self.timeout = setTimeout(function () {
	
	        // ----- this part is optional ----- //
	        // check string array position
	        // on the first string, only delete one word
	        // the stopNum actually represents the amount of chars to
	        // keep in the current string. In my case it's 14.
	        // if (self.arrayPos == 1){
	        //  self.stopNum = 14;
	        // }
	        //every other time, delete the whole typed string
	        // else{
	        //  self.stopNum = 0;
	        // }
	
	        if (self.contentType === 'html') {
	          // skip over html tags while backspacing
	          if (curString.substr(curStrPos).charAt(0) === '>') {
	            var tag = '';
	            while (curString.substr(curStrPos - 1).charAt(0) !== '<') {
	              tag -= curString.substr(curStrPos).charAt(0);
	              curStrPos--;
	              if (curStrPos < 0) {
	                break;
	              }
	            }
	            curStrPos--;
	            tag += '<';
	          }
	        }
	
	        // ----- continue important stuff ----- //
	        // replace text with base text + typed characters
	        var nextString = curString.substr(0, curStrPos);
	        self.replaceText(nextString);
	
	        // if the number (id of character in current string) is
	        // less than the stop number, keep going
	        if (curStrPos > self.stopNum) {
	          // subtract characters one by one
	          curStrPos--;
	          // loop the function
	          self.backspace(curString, curStrPos);
	        }
	        // if the stop number has been reached, increase
	        // array position to next string
	        else if (curStrPos <= self.stopNum) {
	            self.arrayPos++;
	
	            if (self.arrayPos === self.strings.length) {
	              self.arrayPos = 0;
	
	              // Shuffle sequence again
	              if (self.shuffle) self.sequence = self.shuffleArray(self.sequence);
	
	              self.init();
	            } else self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
	          }
	
	        // humanized value for typing
	      }, humanize);
	    }
	
	    // Adds a CSS class to fade out current string
	  }, {
	    key: 'initFadeOut',
	    value: function initFadeOut() {
	      self = this;
	      this.el.className += ' ' + this.fadeOutClass;
	      this.cursor.className += ' ' + this.fadeOutClass;
	      return setTimeout(function () {
	        self.arrayPos++;
	        self.replaceText('');
	
	        // Resets current string if end of loop reached
	        if (self.strings.length > self.arrayPos) {
	          self.typewrite(self.strings[self.sequence[self.arrayPos]], 0);
	        } else {
	          self.typewrite(self.strings[0], 0);
	          self.arrayPos = 0;
	        }
	      }, self.fadeOutDelay);
	    }
	
	    // Replaces current text in the HTML element
	  }, {
	    key: 'replaceText',
	    value: function replaceText(str) {
	      if (this.attr) {
	        this.el.setAttribute(this.attr, str);
	      } else {
	        if (this.isInput) {
	          this.el.value = str;
	        } else if (this.contentType === 'html') {
	          this.el.innerHTML = str;
	        } else {
	          this.el.textContent = str;
	        }
	      }
	    }
	
	    // Shuffles the numbers in the given array.
	  }, {
	    key: 'shuffleArray',
	    value: function shuffleArray(array) {
	      var tmp,
	          current,
	          top = array.length;
	      if (top) while (--top) {
	        current = Math.floor(Math.random() * (top + 1));
	        tmp = array[current];
	        array[current] = array[top];
	        array[top] = tmp;
	      }
	      return array;
	    }
	
	    // Reset and rebuild the element
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var self = this;
	      clearInterval(self.timeout);
	      var id = this.el.getAttribute('id');
	      this.el.textContent = '';
	      if (typeof this.cursor !== 'undefined' && typeof this.cursor.parentNode !== 'undefined') {
	        this.cursor.parentNode.removeChild(this.cursor);
	      }
	      this.strPos = 0;
	      this.arrayPos = 0;
	      this.curLoop = 0;
	      // Send the callback
	      this.options.resetCallback();
	    }
	  }]);
	
	  return Typed;
	})();
	
	exports['default'] = Typed;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var defaults = {
	  strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
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
	  // Fade out instead of backspace
	  fadeOut: false,
	  fadeOutClass: 'typed-fade-out',
	  fadeOutDelay: 500, // milliseconds
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
	  callback: function callback() {},
	  // starting callback function before each string
	  preStringTyped: function preStringTyped() {},
	  //callback for every typed string
	  onStringTyped: function onStringTyped() {},
	  // callback for reset
	  resetCallback: function resetCallback() {}
	};
	
	exports["default"] = defaults;
	module.exports = exports["default"];

/***/ })
/******/ ])
});
;