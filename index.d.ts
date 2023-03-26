/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */

declare module 'typed.js' {
  export interface TypedOptions {
    /**
     * strings to be typed
     */
    strings?: string[];
    /**
     * ID or instance of HTML element of element containing string children
     */
    stringsElement?: string | Element;
    /**
     * type speed in milliseconds
     */
    typeSpeed?: number;
    /**
     * time before typing starts in milliseconds
     */
    startDelay?: number;
    /**
     * backspacing speed in milliseconds
     */
    backSpeed?: number;
    /**
     * only backspace what doesn't match the previous string
     */
    smartBackspace?: boolean;
    /**
     * shuffle the strings
     */
    shuffle?: boolean;
    /**
     * time before backspacing in milliseconds
     */
    backDelay?: number;
    /**
     * Fade out instead of backspace
     */
    fadeOut?: boolean;
    /**
     * css class for fade animation
     */
    fadeOutClass?: string;
    /**
     * Fade out delay in milliseconds
     */
    fadeOutDelay?: number;
    /**
     * loop strings
     */
    loop?: boolean;
    /**
     * amount of loops
     */
    loopCount?: number;
    /**
     * show cursor
     */
    showCursor?: boolean;
    /**
     * character for cursor
     */
    cursorChar?: string;
    /**
     * insert CSS for cursor and fadeOut into HTML
     */
    autoInsertCss?: boolean;
    /**
     * attribute for typing Ex: input placeholder, value, or just HTML text
     */
    attr?: string;
    /**
     * bind to focus and blur if el is text input
     */
    bindInputFocusEvents?: boolean;
    /**
     * 'html' or 'null' for plaintext
     */
    contentType?: string;
    /**
     * All typing is complete
     */
    onComplete?(self: Typed): void;
    /**
     * Before each string is typed
     */
    preStringTyped?(arrayPos: number, self: Typed): void;
    /**
     * After each string is typed
     */
    onStringTyped?(arrayPos: number, self: Typed): void;
    /**
     * During looping, after last string is typed
     */
    onLastStringBackspaced?(self: Typed): void;
    /**
     * Typing has been stopped
     */
    onTypingPaused?(arrayPos: number, self: Typed): void;
    /**
     * Typing has been started after being stopped
     */
    onTypingResumed?(arrayPos: number, self: Typed): void;
    /**
     * After reset
     */
    onReset?(self: Typed): void;
    /**
     * After stop
     */
    onStop?(arrayPos: number, self: Typed): void;
    /**
     * After start
     */
    onStart?(arrayPos: number, self: Typed): void;
    /**
     * After destroy
     */
    onDestroy?(self: Typed): void;
  }

  export default class Typed {
    constructor(elementId: any, options: TypedOptions);
    /**
     * Toggle start() and stop() of the Typed instance
     * @public
     */
    public toggle(): void;
    /**
     * Stop typing / backspacing and enable cursor blinking
     * @public
     */
    public stop(): void;
    /**
     * Start typing / backspacing after being stopped
     * @public
     */
    public start(): void;
    /**
     * Destroy this instance of Typed
     * @public
     */
    public destroy(): void;
    /**
     * Reset Typed and optionally restarts
     * @param {boolean} restart
     * @public
     */
    public reset(restart?: boolean): void;
    cursor: HTMLSpanElement;
    strPos: number;
    arrayPos: number;
    curLoop: number;
    /**
     * Begins the typing animation
     * @private
     */
    private begin;
    typingComplete: boolean;
    timeout: any;
    /**
     * Called for each character typed
     * @param {string} curString the current string in the strings array
     * @param {number} curStrPos the current position in the curString
     * @private
     */
    private typewrite;
    temporaryPause: boolean;
    /**
     * Continue to the next string & begin typing
     * @param {string} curString the current string in the strings array
     * @param {number} curStrPos the current position in the curString
     * @private
     */
    private keepTyping;
    /**
     * We're done typing the current string
     * @param {string} curString the current string in the strings array
     * @param {number} curStrPos the current position in the curString
     * @private
     */
    private doneTyping;
    /**
     * Backspaces 1 character at a time
     * @param {string} curString the current string in the strings array
     * @param {number} curStrPos the current position in the curString
     * @private
     */
    private backspace;
    stopNum: number;
    /**
     * Full animation is complete
     * @private
     */
    private complete;
    /**
     * Has the typing been stopped
     * @param {string} curString the current string in the strings array
     * @param {number} curStrPos the current position in the curString
     * @param {boolean} isTyping
     * @private
     */
    private setPauseStatus;
    /**
     * Toggle the blinking cursor
     * @param {boolean} isBlinking
     * @private
     */
    private toggleBlinking;
    cursorBlinking: any;
    /**
     * Speed in MS to type
     * @param {number} speed
     * @private
     */
    private humanizer;
    /**
     * Shuffle the sequence of the strings array
     * @private
     */
    private shuffleStringsIfNeeded;
    sequence: any;
    /**
     * Adds a CSS class to fade out current string
     * @private
     */
    private initFadeOut;
    /**
     * Replaces current text in the HTML element
     * depending on element type
     * @param {string} str
     * @private
     */
    private replaceText;
    /**
     * If using input elements, bind focus in order to
     * start and stop the animation
     * @private
     */
    private bindFocusEvents;
    /**
     * On init, insert the cursor element
     * @private
     */
    private insertCursor;
  }
}
