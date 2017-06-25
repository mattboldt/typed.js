import _ from "lodash";
import Initializer from './initializer.js'

export default class Typed {

  constructor(elementId, options){
    // chosen element to manipulate text
    this.el = document.getElementById(elementId);
    // Set remaining options
    new Initializer(this, options);
    this.begin();
  }

  begin() {
    // begin the loop w/ first current string (global self.strings)
    // current string will be passed as an argument each time after this
    const self = this;
    self.timeout = setTimeout(function() {
      for (let i in self.strings) {
        self.sequence[i] = i;
      }
      self.shuffleStringsIfNeeded();
      self.setStopNums();

      // Start typing
      // Check if there is some text in the element, if yes start by backspacing the default message
      const currentElContent = self.getCurrentElContent();
      if (currentElContent.length == 0) {
        self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
      } else {
        self.backspace(currentElContent, currentElContent.length);
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
    self.timeout = setTimeout(function() {
      // check for an escape character before a pause value
      // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
      // single ^ are removed from string
      let charPause = 0;
      let substr = curString.substr(curStrPos);
      if (substr.charAt(0) === '^') {
        let skip = 1; // skip atleast 1
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
      self.timeout = setTimeout(function() {
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
            if (self.loop === false || self.curLoop === self.loopCount)
              return;
          }

          self.timeout = setTimeout(function() {
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
          const nextString = curString.substr(0, curStrPos + 1);
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

  backspace(curString, curStrPos) {
    const self = this;
    // exit when stopped
    if (this.stop === true) {
      return;
    }

    if (this.fadeOut){
      this.initFadeOut();
      return;
    }

    this.toggleBlinking(false);

    const humanize = this.humanizer(this.backSpeed);

    self.timeout = setTimeout(function() {

      const curStopNum = self.stopNums[self.arrayPos];

      curStrPos = self.backSpaceHtmlChars(curString, curStrPos);

      // ----- continue important stuff ----- //
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

          self.shuffleStringsIfNeeded()

          self.begin();
        } else
          self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
      }

      // humanized value for typing
    }, humanize);

  }

  typeHtmlChars(curString, curStrPos) {
    if (this.contentType !== 'html') return;
    // skip over html tags while typing
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '<' || curChar === '&') {
      let tag = '';
      let endTag = '';
      if (curChar === '<') {
        endTag = '>'
      }
      else {
        endTag = ';'
      }
      while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
        tag += curString.substr(curStrPos).charAt(0);
        curStrPos++;
        if (curStrPos + 1 > curString.length) { break; }
      }
      curStrPos++;
    }
    return curStrPos;
  }

  backSpaceHtmlChars(curString, curStrPos) {
    if (this.contentType !== 'html') return;
    // skip over html tags while backspacing
    if (curString.substr(curStrPos).charAt(0) === '>') {
      let tag = '';
      while (curString.substr(curStrPos - 1).charAt(0) !== '<') {
        tag -= curString.substr(curStrPos).charAt(0);
        curStrPos--;
        if (curStrPos < 0) { break; }
      }
      curStrPos--;
      tag += '<';
    }
    return curStrPos;
  }

  setStopNums() {
    for (let s in this.strings) {
      const string = this.strings[s];
      const newStopNum = string.split('~')[1];
      if (newStopNum && newStopNum > 0) {
        const regex = /~(\d+)/g;
        this.strings[s] = string.replace(regex, '');
        this.stopNums.push(parseInt(newStopNum));
      }
      else {
        this.stopNums.push(0);
      }
    }
  }

  getCurrentElContent() {
    let elContent = '';
    if (this.attr) {
      elContent = this.el.getAttribute(this.attr);
    }
    else if (this.isInput) {
      elContent = this.el.value;
    } else if (this.contentType === 'html') {
      elContent = this.el.innerHTML;
    } else {
      elContent = this.el.textContent;
    }
    return elContent;
  }

  toggleBlinking(blinking) {
    const status = blinking ? 'infinite' : 0;
    this.cursor.style.animationIterationCount = status;
  }

  humanizer(speed) {
    // varying values for setTimeout during typing
    return Math.round(Math.random() * (100 - 30)) + speed;
  }

  // Adds a CSS class to fade out current string
  initFadeOut(){
    self = this;
    this.el.className += ' ' + this.fadeOutClass;
    this.cursor.className += ' ' + this.fadeOutClass;
    return setTimeout(function() {
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

  // Shuffles the numbers in the given array.
  shuffleStringsIfNeeded(array) {
    if (!this.shuffle) return;
    this.sequence = this.sequence.sort(() => Math.random() - 0.5);
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
    this.options.resetCallback();
  }

}
