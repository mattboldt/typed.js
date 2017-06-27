export default class HTMLParser {
  typeHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    // skip over html tags while typing
    const curChar = curString.substr(curStrPos).charAt(0);
    if (curChar === '<' || curChar === '&') {
      let endTag = '';
      if (curChar === '<') {
        endTag = '>'
      }
      else {
        endTag = ';'
      }
      while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
        curStrPos++;
        if (curStrPos + 1 > curString.length) {
          break;
        }
      }
      curStrPos++;
    }
    return curStrPos;
  }

  backSpaceHtmlChars(curString, curStrPos, self) {
    if (self.contentType !== 'html') return curStrPos;
    const curChar = curString.substr(curStrPos).charAt(0);
    // skip over html tags while backspacing
    if (curChar === '>' || curChar === ';') {
      let endTag = '';
      if (curChar === '>') {
        endTag = '<'
      }
      else {
        endTag = '&'
      }
      while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
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
