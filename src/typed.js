import Initializer from './initializer.js';
import { htmlParser } from './html-parser.js';

export default class Typed {

  constructor(elementId, options){
    // Initialize it up
    new Initializer(this, options, elementId);
    // All systems go!
    this.begin();
  }

  begin() {
    // begin the loop w/ first current string (global self.strings)
    // current string will be passed as an argument each time after this
    const self = this;
    this.typingComplete = false;
    this.shuffleStringsIfNeeded(self);
    this.insertCursor();
    this.bindFocusEvents();
    self.timeout = setTimeout(() => {
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
  typewrite(curString, curStrPos) {
    const self = this;
    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      this.cursor.classList.remove(this.fadeOutClass);
    }

    const humanize = this.humanizer(this.typeSpeed);

    if (self.pause.status === true) {
      self.setPauseStatus(curString, curStrPos, true);
      return;
    }

    // contain typing function in a timeout humanize'd delay
    self.timeout = setTimeout(() => {
      // check for an escape character before a pause value
      // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
      // single ^ are removed from string
      let pauseTime = 0;
      let substr = curString.substr(curStrPos);
      if (substr.charAt(0) === '^') {
        let skip = 1; // skip atleast 1
        if (/^\^\d+/.test(substr)) {
          substr = /\d+/.exec(substr)[0];
          skip += substr.length;
          pauseTime = parseInt(substr);
        }
        self.toggleBlinking(true);

        // strip out the escape character and pause value so they're not printed
        curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
      }

      curStrPos = htmlParser.typeHtmlChars(curString, curStrPos, self);

      // timeout for any pause after a character
      self.timeout = setTimeout(() => {
        // Accounts for blinking while paused
        self.toggleBlinking(false);

        // We're done with this sentence!
        if (curStrPos === curString.length) {
          self.doneTyping(curString, curStrPos);
        }
        else {
          self.keepTyping(curString, curStrPos);
        }
        // end of character pause
      }, pauseTime);

      // humanized value for typing
    }, humanize);

  }

  keepTyping(curString, curStrPos) {
    // call before functions if applicable
    if (curStrPos === 0) {
      this.toggleBlinking(false);
      this.options.preStringTyped(this.arrayPos, this);
    }
    // start typing each new char into existing string
    // curString: arg, this.el.html: original text inside element
    const nextString = curString.substr(0, curStrPos + 1);
    this.replaceText(nextString);
    // add characters one by one
    curStrPos++;
    // loop the function
    this.typewrite(curString, curStrPos);
  }

  doneTyping(curString, curStrPos) {
    const self = this;
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
    self.timeout = setTimeout(() => {
      self.backspace(curString, curStrPos);
    }, self.backDelay);
  }

  backspace(curString, curStrPos) {
    const self = this;
    if (self.pause.status === true) {
      self.setPauseStatus(curString, curStrPos, true);
      return;
    }
    if (this.fadeOut) return this.initFadeOut();

    this.toggleBlinking(false);
    const humanize = this.humanizer(this.backSpeed);

    self.timeout = setTimeout(() => {
      const curStopNum = self.stopNums[self.arrayPos];
      curStrPos = htmlParser.backSpaceHtmlChars(curString, curStrPos, self);
      // replace text with base text + typed characters
      const nextString = curString.substr(0, curStrPos);
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
        }
        else {
          self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
        }
      }
      // humanized value for typing
    }, humanize);

  }

  complete() {
    this.options.onComplete(this);
    this.curLoop++;
    this.typingComplete = true;
  }

  setPauseStatus(curString, curStrPos, isTyping) {
    this.pause.typewrite = isTyping;
    this.pause.curString = curString;
    this.pause.curStrPos = curStrPos;
  }

  toggleBlinking(blinking) {
    // if already paused, don't toggle blinking a 2nd time
    if (!this.cusror) return;
    if (this.pause.status) return;
    if (this.cursorBlinking === blinking) return;
    this.cursorBlinking = blinking;
    const status = blinking ? 'infinite' : 0;
    this.cursor.style.animationIterationCount = status;
  }

  humanizer(speed) {
    // varying values for setTimeout during typing
    return Math.round(Math.random() * (100 - 30)) + speed;
  }

  // Shuffles the numbers in the given array.
  shuffleStringsIfNeeded() {
    if (!this.shuffle) return;
    this.sequence = this.sequence.sort(() => Math.random() - 0.5);
  }

  // Adds a CSS class to fade out current string
  initFadeOut(){
    const self = this;
    this.el.className += ` ${this.fadeOutClass}`;
    this.cursor.className += ` ${this.fadeOutClass}`;
    return setTimeout(() => {
      self.arrayPos++;
      self.replaceText('');

      // Resets current string if end of loop reached
      if(self.strings.length > self.arrayPos) {
        self.typewrite(self.strings[self.sequence[self.arrayPos]], 0);
      } else {
        self.typewrite(self.strings[0], 0);
        self.arrayPos = 0;
      }
    }, self.fadeOutDelay);
  }

  // Replaces current text in the HTML element
  replaceText(str) {
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

  insertCursor() {
    // Insert cursor
    if (!this.showCursor) return;
    this.cursor = document.createElement('span');
    this.cursor.className = 'typed-cursor';
    this.cursor.innerHTML = this.cursorChar;
    this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
  }

  toggle() {
    if (this.pause.status) {
      this.start();
    }
    else {
      this.stop();
    }
  }

  stop() {
    if (this.typingComplete) return;
    if (this.pause.status) return;
    this.toggleBlinking(true);
    this.pause.status = true;
    this.options.onStop(this);
  }

  start() {
    if (this.typingComplete) return;
    if (!this.pause.status) return;
    this.pause.status = false;
    if (this.pause.typewrite) {
      this.typewrite(this.pause.curString, this.pause.curStrPos);
    }
    else {
      this.backspace(this.pause.curString, this.pause.curStrPos);
    }
    this.options.onStart(this);
  }

  destroy() {
    this.reset(false);
    this.options.onDestroy(this);
  }

  // Reset and rebuild the element
  reset(restart = true) {
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

  bindFocusEvents() {
    if (!this.isInput) return;
    const self = this;
    this.el.addEventListener('focus', (e) => {
      self.stop();
    });
    this.el.addEventListener('blur', (e) => {
      self.start();
    });
  }

}
