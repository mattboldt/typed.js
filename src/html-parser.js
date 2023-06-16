/**
 * TODO: These methods can probably be combined somehow
 * Parse HTML tags & HTML Characters
 */

export default class HTMLParser {
  /**
   * Type HTML tags & HTML Characters
   * @param {string} curString Current string
   * @param {number} curStrPos Position in current string
   * @param {Typed} self instance of Typed
   * @returns {number} a new string position
   * @private
   */

  typeHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substring(curStrPos).charAt(0);
    if (curChar === '<' || curChar === '&' || this.isHighSurrogate(curChar)) {
      let endTag = '';
      if (curChar === '<') {
        endTag = '>';
      } else if (curChar === '&') {
        endTag = ';';
      } else if (this.isHighSurrogate(curChar)) {
        endTag = curString.substring(curStrPos).charAt(1);
      }
      while (curString.substring(curStrPos + 1).charAt(0) !== endTag) {
        curStrPos++;
        if (curStrPos + 1 > curString.length) {
          break;
        }
      }
      curStrPos++;
    }
    return curStrPos;
  }

  /**
   * Detect if current character is first half of a surrogate unicode pair
   * @param {char} char Current character
   * @returns {boolean} true if current character is first half of surrogate
   * @private
   */
  isHighSurrogate(char) {
    const code = char.charCodeAt(0);
    return code >= 0xd800 && code <= 0xdbff;
  }

  /**
   * Detect if current character is second half of a surrogate unicode pair
   * @param {char} char Current character
   * @returns {boolean} true if current character is second half of surrogate
   * @private
   */
  isLowSurrogate(char) {
    const code = char.charCodeAt(0);
    return code >= 0xdc00 && code <= 0xdfff;
  }

  /**
   * Backspace HTML tags and HTML Characters
   * @param {string} curString Current string
   * @param {number} curStrPos Position in current string
   * @param {Typed} self instance of Typed
   * @returns {number} a new string position
   * @private
   */
  backSpaceHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substring(curStrPos).charAt(0);
    if (curChar === '>' || curChar === ';' || this.isLowSurrogate(curChar)) {
      let endTag = '';
      if (curChar === '>') {
        endTag = '<';
      } else if (curChar === ';') {
        endTag = '&';
      } else if (this.isLowSurrogate(curChar)) {
        endTag = curString.substring(curStrPos - 1).charAt(0);
      }
      while (curString.substring(curStrPos - 1).charAt(0) !== endTag) {
        curStrPos--;
        if (curStrPos < 0) {
          break;
        }
      }
      curStrPos--;
    }
    return curStrPos;
  }
}

export let htmlParser = new HTMLParser();
