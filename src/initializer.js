import defaults from './defaults.js';

export default class Initializer {
  load(self, options, elementId) {
    // chosen element to manipulate text
    self.el = document.getElementById(elementId);

    self.options = {};
    Object.assign(self.options, defaults, options);

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

    // only backspace what doesn't match the previous string
    self.smartBackspace = self.options.smartBackspace;

    // amount of time to wait before backspacing
    self.backDelay = self.options.backDelay;

    // Fade out instead of backspace
    self.fadeOut = self.options.fadeOut;
    self.fadeOutClass = self.options.fadeOutClass;
    self.fadeOutDelay = self.options.fadeOutDelay;

    // variable to check whether typing is currently paused
    self.isPaused = false;

    // input strings of text
    self.strings = self.options.strings.map((s) => s.trim());

    // div containing strings
    self.stringsElement = document.getElementById(self.options.stringsElement);

    if (self.stringsElement) {
      self.strings = [];
      self.stringsElement.style.display = 'none';
      var strings = Array.prototype.slice.apply(self.stringsElement.children);
      for (let s of strings) {
        self.strings.push(s.innerHTML.trim());
      }
    }

    // character number position of current string
    self.strPos = 0;

    // current array position
    self.arrayPos = 0;

    // index of string to stop backspacing on
    self.stopNum = 0;

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
    }

    // When the typing is complete (when not looped)
    self.typingComplete = false;

    // Set the order in which the strings are typed
    for (let i in self.strings) {
      self.sequence[i] = i;
    }

    // If there is some text in the element
    self.currentElContent = this.getCurrentElContent(self);
  }

  getCurrentElContent(self) {
    let elContent = '';
    if (self.attr) {
      elContent = self.el.getAttribute(self.attr);
    }
    else if (self.isInput) {
      elContent = self.el.value;
    }
    else if (self.contentType === 'html') {
      elContent = self.el.innerHTML;
    }
    else {
      elContent = self.el.textContent;
    }
    return elContent;
  }
}

export let initializer = new Initializer();
