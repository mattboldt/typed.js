(function(){
  prettyPrint();
  let lines = document.querySelectorAll('.prettyprint.linenums li[class^="L"]');
  for (let i = 0; i < lines.length; i++) {
    lines[i].id = 'lineNumber' + (i + 1);
  }

  let matched = location.hash.match(/errorLines=([\d,]+)/);
  if (matched) {
    let lines = matched[1].split(',');
    for (let i = 0; i < lines.length; i++) {
      let id = '#lineNumber' + lines[i];
      let el = document.querySelector(id);
      el.classList.add('error-line');
    }
    return;
  }

  if (location.hash) {
    // ``[ ] . ' " @`` are not valid in DOM id. so must escape these.
    let id = location.hash.replace(/([\[\].'"@$])/g, '\\$1');
    let line = document.querySelector(id);
    if (line) line.classList.add('active');
  }
})();
