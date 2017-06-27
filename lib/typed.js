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
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Typed"] = factory();
	else
		root["Typed"] = factory();
})(this, function() {
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
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _initializerJs = __webpack_require__(1);
	
	var _htmlParserJs = __webpack_require__(3);
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    _classCallCheck(this, Typed);
	
	    // Initialize it up
	    _initializerJs.initializer.load(this, options, elementId);
	    // All systems go!
	    this.begin();
	  }
	
	  _createClass(Typed, [{
	    key: 'begin',
	    value: function begin() {
	      var self = this;
	      this.typingComplete = false;
	      this.shuffleStringsIfNeeded(self);
	      this.insertCursor();
	      if (this.bindInputFocusEvents) this.bindFocusEvents();
	      self.timeout = setTimeout(function () {
	        // Check if there is some text in the element, if yes start by backspacing the default message
	        if (!self.currentElContent || self.currentElContent.length == 0) {
	          self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
	        } else {
	          // Start typing
	          self.backspace(self.currentElContent, self.currentElContent.length);
	        }
	      }, self.startDelay);
	    }
	
	    // pass current string state to each function, types 1 char per call
	  }, {
	    key: 'typewrite',
	    value: function typewrite(curString, curStrPos) {
	      var self = this;
	      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
	        this.el.classList.remove(this.fadeOutClass);
	        this.cursor.classList.remove(this.fadeOutClass);
	      }
	
	      var humanize = this.humanizer(this.typeSpeed);
	
	      if (self.pause.status === true) {
	        self.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	
	      // contain typing function in a timeout humanize'd delay
	      self.timeout = setTimeout(function () {
	        // check for an escape character before a pause value
	        // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
	        // single ^ are removed from string
	        var pauseTime = 0;
	        var substr = curString.substr(curStrPos);
	        if (substr.charAt(0) === '^') {
	          var skip = 1; // skip atleast 1
	          if (/^\^\d+/.test(substr)) {
	            substr = /\d+/.exec(substr)[0];
	            skip += substr.length;
	            pauseTime = parseInt(substr);
	          }
	          self.toggleBlinking(true);
	
	          // strip out the escape character and pause value so they're not printed
	          curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
	        }
	
	        curStrPos = _htmlParserJs.htmlParser.typeHtmlChars(curString, curStrPos, self);
	
	        // timeout for any pause after a character
	        self.timeout = setTimeout(function () {
	          // Accounts for blinking while paused
	          self.toggleBlinking(false);
	
	          // We're done with this sentence!
	          if (curStrPos === curString.length) {
	            self.doneTyping(curString, curStrPos);
	          } else {
	            self.keepTyping(curString, curStrPos);
	          }
	          // end of character pause
	        }, pauseTime);
	
	        // humanized value for typing
	      }, humanize);
	    }
	  }, {
	    key: 'keepTyping',
	    value: function keepTyping(curString, curStrPos) {
	      // call before functions if applicable
	      if (curStrPos === 0) {
	        this.toggleBlinking(false);
	        this.options.preStringTyped(this.arrayPos, this);
	      }
	      // start typing each new char into existing string
	      // curString: arg, this.el.html: original text inside element
	      var nextString = curString.substr(0, curStrPos + 1);
	      this.replaceText(nextString);
	      // add characters one by one
	      curStrPos++;
	      // loop the function
	      this.typewrite(curString, curStrPos);
	    }
	  }, {
	    key: 'doneTyping',
	    value: function doneTyping(curString, curStrPos) {
	      var self = this;
	      // fires callback function
	      self.options.onStringTyped(self.arrayPos, self);
	      self.toggleBlinking(true);
	      // is this the final string
	      if (self.arrayPos === self.strings.length - 1) {
	        // callback that occurs on the last typed string
	        self.complete();
	        // quit if we wont loop back
	        if (self.loop === false || self.curLoop === self.loopCount) {
	          return;
	        }
	      }
	      self.timeout = setTimeout(function () {
	        self.backspace(curString, curStrPos);
	      }, self.backDelay);
	    }
	  }, {
	    key: 'backspace',
	    value: function backspace(curString, curStrPos) {
	      var self = this;
	      if (self.pause.status === true) {
	        self.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	      if (this.fadeOut) return this.initFadeOut();
	
	      this.toggleBlinking(false);
	      var humanize = this.humanizer(this.backSpeed);
	
	      self.timeout = setTimeout(function () {
	        var curStopNum = self.stopNums[self.arrayPos];
	        curStrPos = _htmlParserJs.htmlParser.backSpaceHtmlChars(curString, curStrPos, self);
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
	            // When looping, begin at the beginning after backspace complete
	            if (self.arrayPos === self.strings.length) {
	              self.arrayPos = 0;
	              self.options.onLastStringBackspaced();
	              self.shuffleStringsIfNeeded();
	              self.begin();
	            } else {
	              self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
	            }
	          }
	        // humanized value for typing
	      }, humanize);
	    }
	  }, {
	    key: 'complete',
	    value: function complete() {
	      this.options.onComplete(this);
	      this.curLoop++;
	      this.typingComplete = true;
	    }
	  }, {
	    key: 'setPauseStatus',
	    value: function setPauseStatus(curString, curStrPos, isTyping) {
	      this.pause.typewrite = isTyping;
	      this.pause.curString = curString;
	      this.pause.curStrPos = curStrPos;
	    }
	  }, {
	    key: 'toggleBlinking',
	    value: function toggleBlinking(blinking) {
	      // if already paused, don't toggle blinking a 2nd time
	      if (!this.cusror) return;
	      if (this.pause.status) return;
	      if (this.cursorBlinking === blinking) return;
	      this.cursorBlinking = blinking;
	      var status = blinking ? 'infinite' : 0;
	      this.cursor.style.animationIterationCount = status;
	    }
	  }, {
	    key: 'humanizer',
	    value: function humanizer(speed) {
	      // varying values for setTimeout during typing
	      return Math.round(Math.random() * (100 - 30)) + speed;
	    }
	
	    // Shuffles the numbers in the given array.
	  }, {
	    key: 'shuffleStringsIfNeeded',
	    value: function shuffleStringsIfNeeded() {
	      if (!this.shuffle) return;
	      this.sequence = this.sequence.sort(function () {
	        return Math.random() - 0.5;
	      });
	    }
	
	    // Adds a CSS class to fade out current string
	  }, {
	    key: 'initFadeOut',
	    value: function initFadeOut() {
	      var self = this;
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
	  }, {
	    key: 'insertCursor',
	    value: function insertCursor() {
	      // Insert cursor
	      if (!this.showCursor) return;
	      this.cursor = document.createElement('span');
	      this.cursor.className = 'typed-cursor';
	      this.cursor.innerHTML = this.cursorChar;
	      this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
	    }
	  }, {
	    key: 'toggle',
	    value: function toggle() {
	      this.pause.status ? this.start() : this.stop();
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      if (this.typingComplete) return;
	      if (this.pause.status) return;
	      this.toggleBlinking(true);
	      this.pause.status = true;
	      this.options.onStop(this);
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      if (this.typingComplete) return;
	      if (!this.pause.status) return;
	      this.pause.status = false;
	      if (this.pause.typewrite) {
	        this.typewrite(this.pause.curString, this.pause.curStrPos);
	      } else {
	        this.backspace(this.pause.curString, this.pause.curStrPos);
	      }
	      this.options.onStart(this);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.reset(false);
	      this.options.onDestroy(this);
	    }
	
	    // Reset and rebuild the element
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var restart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      clearInterval(this.timeout);
	      this.replaceText('');
	      if (typeof this.cursor !== 'undefined' && typeof this.cursor.parentNode !== 'undefined') {
	        this.cursor.parentNode.removeChild(this.cursor);
	      }
	      this.strPos = 0;
	      this.arrayPos = 0;
	      this.curLoop = 0;
	      if (restart) {
	        this.options.onReset(this);
	        this.begin();
	      }
	    }
	  }, {
	    key: 'bindFocusEvents',
	    value: function bindFocusEvents() {
	      if (!this.isInput) return;
	      var self = this;
	      this.el.addEventListener('focus', function (e) {
	        self.stop();
	      });
	      this.el.addEventListener('blur', function (e) {
	        self.start();
	      });
	    }
	  }]);
	
	  return Typed;
	})();
	
	exports['default'] = Typed;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defaultsJs = __webpack_require__(2);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	var Initializer = (function () {
	  function Initializer() {
	    _classCallCheck(this, Initializer);
	  }
	
	  _createClass(Initializer, [{
	    key: 'load',
	    value: function load(self, options, elementId) {
	      // chosen element to manipulate text
	      self.el = document.getElementById(elementId);
	
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
	      self.bindInputFocusEvents = self.options.bindInputFocusEvents;
	
	      // show cursor
	      self.showCursor = self.isInput ? false : self.options.showCursor;
	
	      // custom cursor
	      self.cursorChar = self.options.cursorChar;
	
	      // Is the cursor blinking
	      self.cursorBlinking = true;
	
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
	
	      // shuffle the strings
	      self.shuffle = self.options.shuffle;
	      // the order of strings
	      self.sequence = [];
	
	      self.pause = {
	        status: false,
	        typewrite: true,
	        curString: '',
	        curStrPos: 0
	      };
	
	      // When the typing is complete (when not looped)
	      self.typingComplete = false;
	
	      // div containing strings
	      self.stringsElement = document.getElementById(self.options.stringsElement);
	
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
	
	      // Set the order in which the strings are typed
	      for (var i in self.strings) {
	        self.sequence[i] = i;
	      }
	
	      // Using the `~12` syntax, set each string's stop number
	      // (stops backspacing at a certain digit)
	      this.setStopNums(self);
	
	      // If there is some text in the element
	      self.currentElContent = this.getCurrentElContent(self);
	    }
	  }, {
	    key: 'setStopNums',
	    value: function setStopNums(self) {
	      for (var s in self.strings) {
	        var string = self.strings[s];
	        var newStopNum = string.split('~')[1];
	        if (newStopNum && newStopNum > 0) {
	          var regex = /~(\d+)/g;
	          self.strings[s] = string.replace(regex, '');
	          self.stopNums.push(parseInt(newStopNum));
	        } else {
	          self.stopNums.push(0);
	        }
	      }
	    }
	  }, {
	    key: 'getCurrentElContent',
	    value: function getCurrentElContent(self) {
	      var elContent = '';
	      if (self.attr) {
	        elContent = self.el.getAttribute(self.attr);
	      } else if (self.isInput) {
	        elContent = self.el.value;
	      } else if (self.contentType === 'html') {
	        elContent = self.el.innerHTML;
	      } else {
	        elContent = self.el.textContent;
	      }
	      return elContent;
	    }
	  }]);
	
	  return Initializer;
	})();
	
	exports['default'] = Initializer;
	var initializer = new Initializer();
	exports.initializer = initializer;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var defaults = {
	  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
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
	  cursorChar: '|',
	  // attribute to type (null == text)
	  attr: null,
	  // Bind to focus and blur if el is text input
	  bindInputFocusEvents: false,
	  // either html or text
	  contentType: 'html',
	  // call when done callback function
	  onComplete: function onComplete(self) {},
	  // starting callback function before each string
	  preStringTyped: function preStringTyped(arrayPos, self) {},
	  // callback for every typed string
	  onStringTyped: function onStringTyped(arrayPos, self) {},
	  // During looping, this is when the last string is backspaced
	  onLastStringBackspaced: function onLastStringBackspaced(self) {},
	  // callbacks for pause / play / reset / destroy
	  onReset: function onReset(self) {},
	  onStop: function onStop(self) {},
	  onStart: function onStart(self) {},
	  onDestroy: function onDestroy(self) {}
	};
	
	exports['default'] = defaults;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var HTMLParser = (function () {
	  function HTMLParser() {
	    _classCallCheck(this, HTMLParser);
	  }
	
	  _createClass(HTMLParser, [{
	    key: 'typeHtmlChars',
	    value: function typeHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
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
	          tag += curChar;
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
	    value: function backSpaceHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.substr(curStrPos).charAt(0);
	      // skip over html tags while backspacing
	      if (curChar === '>' || curChar === ';') {
	        var tag = '';
	        var endTag = '';
	        if (curChar === '>') {
	          endTag = '<';
	        } else {
	          endTag = '&';
	        }
	        while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
	          tag -= curChar;
	          curStrPos--;
	          if (curStrPos < 0) {
	            break;
	          }
	        }
	        curStrPos--;
	      }
	      return curStrPos;
	    }
	  }]);
	
	  return HTMLParser;
	})();
	
	exports['default'] = HTMLParser;
	var htmlParser = new HTMLParser();
	exports.htmlParser = htmlParser;

/***/ })
/******/ ])
});
;