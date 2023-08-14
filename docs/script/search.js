(function(){
  let searchIndex = window.esdocSearchIndex;
  let searchBox = document.querySelector('.search-box');
  let input = document.querySelector('.search-input');
  let result = document.querySelector('.search-result');
  let selectedIndex = -1;
  let prevText;

  // active search box and focus when mouse enter on search box.
  searchBox.addEventListener('mouseenter', function(){
    searchBox.classList.add('active');
    input.focus();
  });

  // search with text when key is upped.
  input.addEventListener('keyup', function(ev){
    let text = ev.target.value.toLowerCase();
    if (!text) {
      result.style.display = 'none';
      result.innerHTML = '';
      return;
    }

    if (text === prevText) return;
    prevText = text;

    let html = {class: [], method: [], member: [], function: [], variable: [], typedef: [], external: [], file: [], test: [], testFile: []};
    let len = searchIndex.length;
    let kind;
    for (let i = 0; i < len; i++) {
      let pair = searchIndex[i];
      if (pair[0].indexOf(text) !== -1) {
        kind = pair[3];
        html[kind].push('<li><a href="' + pair[1] + '">' + pair[2] + '</a></li>');
      }
    }

    let innerHTML = '';
    for (kind in html) {
      let list = html[kind];
      if (!list.length) continue;
      innerHTML += '<li class="search-separator">' + kind + '</li>\n' + list.join('\n');
    }
    result.innerHTML = innerHTML;
    if (innerHTML) result.style.display = 'block';
    selectedIndex = -1;
  });

  // down, up and enter key are pressed, select search result.
  input.addEventListener('keydown', function(ev){
    if (ev.keyCode === 40) {
      // arrow down
      let current = result.children[selectedIndex];
      let selected = result.children[selectedIndex + 1];
      if (selected && selected.classList.contains('search-separator')) {
        let selected = result.children[selectedIndex + 2];
        selectedIndex++;
      }

      if (selected) {
        if (current) current.classList.remove('selected');
        selectedIndex++;
        selected.classList.add('selected');
      }
    } else if (ev.keyCode === 38) {
      // arrow up
      let current = result.children[selectedIndex];
      let selected = result.children[selectedIndex - 1];
      if (selected && selected.classList.contains('search-separator')) {
        let selected = result.children[selectedIndex - 2];
        selectedIndex--;
      }

      if (selected) {
        if (current) current.classList.remove('selected');
        selectedIndex--;
        selected.classList.add('selected');
      }
    } else if (ev.keyCode === 13) {
      // enter
      let current = result.children[selectedIndex];
      if (current) {
        let link = current.querySelector('a');
        if (link) location.href = link.href;
      }
    } else {
      return;
    }

    ev.preventDefault();
  });

  // select search result when search result is mouse over.
  result.addEventListener('mousemove', function(ev){
    let current = result.children[selectedIndex];
    if (current) current.classList.remove('selected');

    let li = ev.target;
    while (li) {
      if (li.nodeName === 'LI') break;
      li = li.parentElement;
    }

    if (li) {
      selectedIndex = Array.prototype.indexOf.call(result.children, li);
      li.classList.add('selected');
    }
  });

  // clear search result when body is clicked.
  document.body.addEventListener('click', function(ev){
    selectedIndex = -1;
    result.style.display = 'none';
    result.innerHTML = '';
  });

})();
