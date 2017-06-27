var defaults = {
  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
  stringsElement: null,
  // typing speed
  typeSpeed: 0,
  // time before typing starts
  startDelay: 0,
  // backspacing speed
  backSpeed: 0,
  // only backspace what doesn't match the previous string
  smartBackspace: true,
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
  onComplete: (self) => {},
  // starting callback function before each string
  preStringTyped: (arrayPos, self) => {},
  // callback for every typed string
  onStringTyped: (arrayPos, self) => {},
  // During looping, this is when the last string is backspaced
  onLastStringBackspaced: (self) => {},
  // callback for when a pause begins
  onTypingPaused: (arrayPos, self) => {},
  // callback for when a pause is completed
  onTypingResumed: (arrayPos, self) => {},
  // callbacks for pause / play / reset / destroy
  onReset: (self) => {},
  onStop: (arrayPos, self) => {},
  onStart: (arrayPos, self) => {},
  onDestroy: (self) => {}
};

export default defaults;
