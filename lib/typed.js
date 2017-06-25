/*!
 * 
 *   typed.js - A jQuery typing animation script
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.0
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
	
	var _initializerJs = __webpack_require__(2);
	
	var _initializerJs2 = _interopRequireDefault(_initializerJs);
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    _classCallCheck(this, Typed);
	
	    // chosen element to manipulate text
	    this.el = document.getElementById(elementId);
	    // Set remaining options
	    new _initializerJs2['default'](this, options);
	    this.begin();
	  }
	
	  _createClass(Typed, [{
	    key: 'begin',
	    value: function begin() {
	      // begin the loop w/ first current string (global self.strings)
	      // current string will be passed as an argument each time after this
	      var self = this;
	      self.timeout = setTimeout(function () {
	        for (var i in self.strings) {
	          self.sequence[i] = i;
	        }
	        self.shuffleStringsIfNeeded();
	        self.setStopNums();
	
	        // Start typing
	        // Check if there is some text in the element, if yes start by backspacing the default message
	        var currentElContent = self.getCurrentElContent();
	        if (currentElContent.length == 0) {
	          self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
	        } else {
	          self.backspace(currentElContent, currentElContent.length);
	        }
	      }, self.startDelay);
	    }
	
	    // pass current string state to each function, types 1 char per call
	  }, {
	    key: 'typewrite',
	    value: function typewrite(curString, curStrPos) {
	      // exit when stopped
	      if (this.stop === true) return;
	
	      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
	        this.el.classList.remove(this.fadeOutClass);
	        this.cursor.classList.remove(this.fadeOutClass);
	      }
	
	      var humanize = this.humanizer(this.typeSpeed);
	      var self = this;
	
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
	
	        curStrPos = self.typeHtmlChars(curString, curStrPos);
	
	        // timeout for any pause after a character
	        self.timeout = setTimeout(function () {
	          if (curStrPos === curString.length) {
	            // fires callback function
	            self.options.onStringTyped(self.arrayPos);
	
	            self.toggleBlinking(true);
	
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
	              self.toggleBlinking(false);
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
	
	      this.toggleBlinking(false);
	
	      var humanize = this.humanizer(this.backSpeed);
	
	      self.timeout = setTimeout(function () {
	
	        var curStopNum = self.stopNums[self.arrayPos];
	
	        curStrPos = self.backSpaceHtmlChars(curString, curStrPos);
	
	        // ----- continue important stuff ----- //
	        // replace text with base text + typed characters
	        var nextString = curString.substr(0, curStrPos);
	        self.replaceText(nextString);
	
	        // if the number (id of character in current string) is
	        // less than the stop number, keep going
	        if (curStrPos > curStopNum) {
	          // subtract characters one by one
	          curStrPos--;
	          // loop the function
	          self.backspace(curString, curStrPos);
	        }
	        // if the stop number has been reached, increase
	        // array position to next string
	        else if (curStrPos <= curStopNum) {
	            self.arrayPos++;
	
	            if (self.arrayPos === self.strings.length) {
	              self.arrayPos = 0;
	
	              self.shuffleStringsIfNeeded();
	
	              self.begin();
	            } else self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
	          }
	
	        // humanized value for typing
	      }, humanize);
	    }
	  }, {
	    key: 'typeHtmlChars',
	    value: function typeHtmlChars(curString, curStrPos) {
	      if (this.contentType !== 'html') return;
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
	      }
	      return curStrPos;
	    }
	  }, {
	    key: 'backSpaceHtmlChars',
	    value: function backSpaceHtmlChars(curString, curStrPos) {
	      if (this.contentType !== 'html') return;
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
	      return curStrPos;
	    }
	  }, {
	    key: 'setStopNums',
	    value: function setStopNums() {
	      for (var s in this.strings) {
	        var string = this.strings[s];
	        var newStopNum = string.split('~')[1];
	        if (newStopNum && newStopNum > 0) {
	          var regex = /~(\d+)/g;
	          this.strings[s] = string.replace(regex, '');
	          this.stopNums.push(parseInt(newStopNum));
	        } else {
	          this.stopNums.push(0);
	        }
	      }
	    }
	  }, {
	    key: 'getCurrentElContent',
	    value: function getCurrentElContent() {
	      var elContent = '';
	      if (this.attr) {
	        elContent = this.el.getAttribute(this.attr);
	      } else if (this.isInput) {
	        elContent = this.el.value;
	      } else if (this.contentType === 'html') {
	        elContent = this.el.innerHTML;
	      } else {
	        elContent = this.el.textContent;
	      }
	      return elContent;
	    }
	  }, {
	    key: 'toggleBlinking',
	    value: function toggleBlinking(blinking) {
	      var status = blinking ? 'infinite' : 0;
	      this.cursor.style.animationIterationCount = status;
	    }
	  }, {
	    key: 'humanizer',
	    value: function humanizer(speed) {
	      // varying values for setTimeout during typing
	      return Math.round(Math.random() * (100 - 30)) + speed;
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
	    key: 'shuffleStringsIfNeeded',
	    value: function shuffleStringsIfNeeded(array) {
	      if (!this.shuffle) return;
	      this.sequence = this.sequence.sort(function () {
	        return Math.random() - 0.5;
	      });
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defaultsJs = __webpack_require__(3);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	var Initializer = function Initializer(self, options) {
	  _classCallCheck(this, Initializer);
	
	  // options
	  self.options = {};
	  Object.keys(_defaultsJs2['default']).forEach(function (key) {
	    self.options[key] = _defaultsJs2['default'][key];
	  });
	  Object.keys(options).forEach(function (key) {
	    self.options[key] = options[key];
	  });
	
	  // attribute to type into
	  self.isInput = self.el.tagName.toLowerCase() === 'input';
	  self.attr = self.options.attr;
	
	  // show cursor
	  self.showCursor = self.isInput ? false : self.options.showCursor;
	
	  // text content of element
	  self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;
	
	  // html or plain text
	  self.contentType = self.options.contentType;
	
	  // typing speed
	  self.typeSpeed = self.options.typeSpeed;
	
	  // add a delay before typing starts
	  self.startDelay = self.options.startDelay;
	
	  // backspacing speed
	  self.backSpeed = self.options.backSpeed;
	
	  // amount of time to wait before backspacing
	  self.backDelay = self.options.backDelay;
	
	  // Fade out instead of backspace
	  self.fadeOut = self.options.fadeOut;
	  self.fadeOutClass = self.options.fadeOutClass;
	  self.fadeOutDelay = self.options.fadeOutDelay;
	
	  // input strings of text
	  self.strings = self.options.strings;
	
	  // character number position of current string
	  self.strPos = 0;
	
	  // current array position
	  self.arrayPos = 0;
	
	  // number to stop backspacing on.
	  // default 0, can change depending on how many chars
	  // you want to remove at the time
	  self.stopNums = [];
	
	  // Looping logic
	  self.loop = self.options.loop;
	  self.loopCount = self.options.loopCount;
	  self.curLoop = 0;
	
	  // for stopping
	  self.stop = false;
	
	  // custom cursor
	  self.cursorChar = self.options.cursorChar;
	
	  // shuffle the strings
	  self.shuffle = self.options.shuffle;
	  // the order of strings
	  self.sequence = [];
	
	  // div containing strings
	  self.stringsElement = document.getElementById(self.options.stringsElement);
	
	  // Insert cursor
	  if (self.showCursor) {
	    self.cursor = document.createElement('span');
	    self.cursor.className = 'typed-cursor';
	    self.cursor.innerHTML = self.cursorChar;
	    self.el.parentNode && self.el.parentNode.insertBefore(self.cursor, self.el.nextSibling);
	  }
	  if (self.stringsElement) {
	    self.strings = [];
	    self.stringsElement.style.display = 'none';
	    var strings = Array.prototype.slice.apply(self.stringsElement.children);
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	      for (var _iterator = strings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var s = _step.value;
	
	        self.strings.push(s.innerHTML);
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator['return']) {
	          _iterator['return']();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }
	};
	
	exports['default'] = Initializer;
	module.exports = exports['default'];

/***/ }),
/* 3 */
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
	  loopCount: Infinity,
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