/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */
export default class Typed {
    constructor(elementId: any, options: any);
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
