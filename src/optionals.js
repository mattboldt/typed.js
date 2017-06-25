import defaults from './defaults.js';

export default class Optionals {
  constructor(self, options) {

    // options
    self.options = {};
    Object.keys(defaults).forEach(function(key) {
      self.options[key] = defaults[key];
    });
    Object.keys(options).forEach(function(key) {
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
  }
}
