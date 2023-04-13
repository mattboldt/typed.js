import { initializer } from './initializer.js';
import { htmlParser } from './html-parser.js';

/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */
export default class Typed {
  constructor(elementId, options) {
    // Initialize it up
    initializer.load(this, options, elementId);
    // All systems go!
    this.begin();
  }

  /**
   * Toggle start() and stop() of the Typed instance
   * @public
   */
  toggle() {
    this.pause.status ? this.start() : this.stop();
  }

  /**
   * Stop typing / backspacing and enable cursor blinking
   * @public
   */
  stop() {
    if (this.typingComplete) return;
    if (this.pause.status) return;
    this.toggleBlinking(true);
    this.pause.status = true;
    this.options.onStop(this.arrayPos, this);
  }

  /**
   * Start typing / backspacing after being stopped
   * @public
   */
  start() {
    if (this.typingComplete) return;
    if (!this.pause.status) return;
    this.pause.status = false;
    if (this.pause.typewrite) {
      this.typewrite(this.pause.curString, this.pause.curStrPos);
    } else {
      this.backspace(this.pause.curString, this.pause.curStrPos);
    }
    this.options.onStart(this.arrayPos, this);
  }

  /**
   * Destroy this instance of Typed
   * @public
   */
  destroy() {
    this.reset(false);
    this.options.onDestroy(this);
  }

  /**
   * Reset Typed and optionally restarts
   * @param {boolean} restart
   * @public
   */
  reset(restart = true) {
    cancelAnimationFrame(this.animationFrame);
    this.replaceText('');
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
      this.cursor = null;
    }
    this.strPos = 0;
    this.arrayPos = 0;
    this.curLoop = 0;
    if (restart) {
      this.insertCursor();
      this.options.onReset(this);
      this.begin();
    }
  }

  /**
   * Begins the typing animation
   * @private
   */
  begin() {
    this.options.onBegin(this);
    this.typingComplete = false;
    this.shuffleStringsIfNeeded(this);
    this.insertCursor();
    if (this.bindInputFocusEvents) this.bindFocusEvents();
    this.animateLoop();
  }

  /**
   * @returns 
   */
  animateLoop() {
    if (this.isPaused) {
      this.animationFrame = requestAnimationFrame(() => this.animateLoop());
      return;
    }

    const now = Date.now();
    const delta = now - this.lastFrameTime;

    if (delta >= this.typeSpeed) {
      if (!this.currentElContent || this.currentElContent.length === 0) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);
      } else {
        this.backspace(this.currentElContent, this.currentElContent.length);
      }
      this.lastFrameTime = now;
    }
    this.animationFrame = requestAnimationFrame(() => this.animateLoop());
  }



  /**
   * Called for each character typed
   * @param {string} curString the current string in the strings array
   * @param {number} curStrPos the current position in the curString
   * @private
   */
  typewrite(curString, curStrPos) {
    // Exit when stopped
    if (this.stop === true) {
      return;
    }
  
    // Set the animation frame timestamp for the first time
    if (!this.lastFrameTime) {
      this.lastFrameTime = Date.now();
    }
  
    // Looping through strings
    const humanize = this.humanizer(this.typeSpeed);
  
    // Make sure the current string position is within the current string
    if (curStrPos < curString.length) {
      // Check if smartBackspace is enabled
      if (this.smartBackspace) {
        const nextString = this.strings[this.sequence[this.arrayPos + 1]];
        if (nextString && curString.substr(0, curStrPos) === nextString.substr(0, curStrPos)) {
          this.backspace(curString, curStrPos);
          return;
        }
      }
  
      if (curString.substr(curStrPos, 1) === '^') {
        const skip = 1; // Skip at least the ^ char
        if (/^\^\d+/.test(curString.substr(curStrPos, 3))) {
          const skipMatch = curString.substr(curStrPos).match(/^\^(\d+)/);
          curString = curString.replace(skipMatch[0], '');
          this.typeSpeed = parseInt(skipMatch[1], 10);
        }
        curStrPos += skip;
      }
  
      // Continue typing
      this.el.innerHTML = htmlParser.typeHtmlChars(curString.substr(0, curStrPos), this);
      curStrPos++;
      this.strPos = curStrPos;
    } else {
      // Finished typing current string
      this.arrayPos++;
  
      if (this.arrayPos === this.strings.length) {
        this.complete();
        return;
      }
  
      this.typingComplete = true;
    }
    if(this.typingComplete){
      this.doneTyping(curString, curStrPos)
    }
  }

  /**
   * Continue to the next string & begin typing
   * @param {string} curString the current string in the strings array
   * @param {number} curStrPos the current position in the curString
   * @private
   */
  keepTyping(curString, curStrPos, numChars) {
    // call before functions if applicable
    if (curStrPos === 0) {
      this.toggleBlinking(false);
      this.options.preStringTyped(this.arrayPos, this);
    }
    // start typing each new char into existing string
    // curString: arg, this.el.html: original text inside element
    curStrPos += numChars;
    const nextString = curString.substr(0, curStrPos);
    this.replaceText(nextString);
    // loop the function
    this.typewrite(curString, curStrPos);
  }

  /**
   * We're done typing the current string
   * @param {string} curString the current string in the strings array
   * @param {number} curStrPos the current position in the curString
   * @private
   */
  doneTyping(curString, curStrPos) {
    // fires callback function
    this.options.onStringTyped(this.arrayPos, this);
    this.toggleBlinking(true);
    // is this the final string
    if (this.arrayPos === this.strings.length - 1) {
      // callback that occurs on the last typed string
      this.complete();
      // quit if we wont loop back
      if (this.loop === false || this.curLoop === this.loopCount) {
        return;
      }
    }
  }

  /**
 * Backspaces 1 character at a time
 * @param {string} curString the current string in the strings array
 * @param {number} curStrPos the current position in the curString
 * @private
 */
  backspace(curString, curStrPos) {
    // Exit when stopped
    if (this.stop === true) {
      return;
    }
  
    // Set the animation frame timestamp for the first time
    if (!this.lastFrameTime) {
      this.lastFrameTime = Date.now();
    }
  
    // Loop through the string, backspacing to the beginning
    if (curStrPos > 0) {
      // Replace text with the substring up to the new string position
      this.el.innerHTML = htmlParser.typeHtmlChars(curString.substr(0, curStrPos - 1), this);
      curStrPos--;
      this.strPos = curStrPos;
    } else {
      // Finished backspacing current string
      this.typingComplete = true;
    }
  }


  /**
   * Full animation is complete
   * @private
   */
  complete() {
    this.options.onComplete(this);
    if (this.loop) {
      this.curLoop++;
    } else {
      this.typingComplete = true;
    }
  }

  /**
   * Has the typing been stopped
   * @param {string} curString the current string in the strings array
   * @param {number} curStrPos the current position in the curString
   * @param {boolean} isTyping
   * @private
   */
  setPauseStatus(curString, curStrPos, isTyping) {
    this.pause.typewrite = isTyping;
    this.pause.curString = curString;
    this.pause.curStrPos = curStrPos;
  }

  /**
   * Toggle the blinking cursor
   * @param {boolean} isBlinking
   * @private
   */
  toggleBlinking(isBlinking) {
    if (!this.cursor) return;
    // if in paused state, don't toggle blinking a 2nd time
    if (this.pause.status) return;
    if (this.cursorBlinking === isBlinking) return;
    this.cursorBlinking = isBlinking;
    if (isBlinking) {
      this.cursor.classList.add('typed-cursor--blink');
    } else {
      this.cursor.classList.remove('typed-cursor--blink');
    }
  }

  /**
   * Speed in MS to type
   * @param {number} speed
   * @private
   */
  humanizer(speed) {
    return Math.round((Math.random() * speed) / 2) + speed;
  }

  /**
   * Shuffle the sequence of the strings array
   * @private
   */
  shuffleStringsIfNeeded() {
    if (!this.shuffle) return;
    this.sequence = this.sequence.sort(() => Math.random() - 0.5);
  }

  /**
   * Adds a CSS class to fade out current string
   * @private
   */
  initFadeOut() {
    this.el.className += ` ${this.fadeOutClass}`;
    if (this.cursor) this.cursor.className += ` ${this.fadeOutClass}`;
    return setTimeout(() => {
      this.arrayPos++;
      this.replaceText('');

      // Resets current string if end of loop reached
      if (this.strings.length > this.arrayPos) {
        this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);
      } else {
        this.typewrite(this.strings[0], 0);
        this.arrayPos = 0;
      }
    }, this.fadeOutDelay);
  }

  /**
   * Replaces current text in the HTML element
   * depending on element type
   * @param {string} str
   * @private
   */
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

  /**
   * If using input elements, bind focus in order to
   * start and stop the animation
   * @private
   */
  bindFocusEvents() {
    if (!this.isInput) return;
    this.el.addEventListener('focus', (e) => {
      this.stop();
    });
    this.el.addEventListener('blur', (e) => {
      if (this.el.value && this.el.value.length !== 0) {
        return;
      }
      this.start();
    });
  }

  /**
   * On init, insert the cursor element
   * @private
   */
  insertCursor() {
    if (!this.showCursor) return;
    if (this.cursor) return;
    this.cursor = document.createElement('span');
    this.cursor.className = 'typed-cursor';
    this.cursor.setAttribute('aria-hidden', true);
    this.cursor.innerHTML = this.cursorChar;
    this.el.parentNode &&
      this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
  }
}
