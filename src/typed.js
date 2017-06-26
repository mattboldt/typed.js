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
    this.shuffleStringsIfNeeded(self);
    this.insertCursor();
    self.timeout = setTimeout(() => {
      // Check if there is some text in the element, if yes start by backspacing the default message
      if (self.currentElContent.length == 0) {
        self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
      } else {
        // Start typing
        self.backspace(self.currentElContent, self.currentElContent.length);
      }
    }, self.startDelay);
  }

  // pass current string state to each function, types 1 char per call
  typewrite(curString, curStrPos) {
    // exit when stopped
    if (this.stop === true) return;

    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
      this.el.classList.remove(this.fadeOutClass);
      this.cursor.classList.remove(this.fadeOutClass);
    }

    const humanize = this.humanizer(this.typeSpeed);
    const self = this;

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
      this.options.preStringTyped(this.arrayPos);
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
    self.options.onStringTyped(self.arrayPos);
    self.toggleBlinking(true);
    // is this the final string
    if (self.arrayPos === self.strings.length - 1) {
      // callback that occurs on the last typed string
      self.options.onComplete();
      self.curLoop++;
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
    // exit when stopped
    if (this.stop) return;
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

  toggleBlinking(blinking) {
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
    this.el.className += ' ' + this.fadeOutClass;
    this.cursor.className += ' ' + this.fadeOutClass;
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

  pause() {

  }

  play() {

  }

  stop() {

  }

  // Reset and rebuild the element
  reset() {
    const self = this;
    clearInterval(self.timeout);
    this.el.textContent = '';
    if (typeof this.cursor !== 'undefined' && typeof this.cursor.parentNode !== 'undefined') {
      this.cursor.parentNode.removeChild(this.cursor);
    }
    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
    // Send the callback
    this.options.onReset();
    this.begin();
  }

}
