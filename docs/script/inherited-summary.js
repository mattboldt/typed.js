(function(){
  function toggle(ev) {
    let button = ev.target;
    let parent = ev.target.parentElement;
    while(parent) {
      if (parent.tagName === 'TABLE' && parent.classList.contains('summary')) break;
      parent = parent.parentElement;
    }

    if (!parent) return;

    let tbody = parent.querySelector('tbody');
    if (button.classList.contains('opened')) {
      button.classList.remove('opened');
      button.classList.add('closed');
      tbody.style.display = 'none';
    } else {
      button.classList.remove('closed');
      button.classList.add('opened');
      tbody.style.display = 'block';
    }
  }

  let buttons = document.querySelectorAll('.inherited-summary thead .toggle');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', toggle);
  }
})();
