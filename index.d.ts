/**
 * Declaration for typed.js
 * Typed.js version: v2.0.12
 */

declare module 'typed.js' {
  interface TypedOptions {
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
    constructor(elementId: string | Element, options: TypedOptions);
    toggle(): void;
    stop(): void;
    start(): void;
    destroy(): void;
    reset(restart?: boolean): void;
  }
}
