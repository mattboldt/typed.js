(function(){
  function toggle(ev) {
    let button = ev.target;
    let parent = ev.target.parentElement;
    while(parent) {
      if (parent.tagName === 'TR' && parent.classList.contains('test-interface')) break;
      parent = parent.parentElement;
    }

    if (!parent) return;

    let direction;
    if (button.classList.contains('opened')) {
      button.classList.remove('opened');
      button.classList.add('closed');
      direction = 'closed';
    } else {
      button.classList.remove('closed');
      button.classList.add('opened');
      direction = 'opened';
    }

    let targetDepth = parseInt(parent.dataset.testDepth, 10) + 1;
    let nextElement = parent.nextElementSibling;
    while (nextElement) {
      let depth = parseInt(nextElement.dataset.testDepth, 10);
      if (depth >= targetDepth) {
        if (direction === 'opened') {
          if (depth === targetDepth)  nextElement.style.display = '';
        } else if (direction === 'closed') {
          nextElement.style.display = 'none';
          var innerButton = nextElement.querySelector('.toggle');
          if (innerButton && innerButton.classList.contains('opened')) {
            innerButton.classList.remove('opened');
            innerButton.classList.add('closed');
          }
        }
      } else {
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
  }

  let buttons = document.querySelectorAll('.test-summary tr.test-interface .toggle');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', toggle);
  }

  let topDescribes = document.querySelectorAll('.test-summary tr[data-test-depth="0"]');
  for (let i = 0; i < topDescribes.length; i++) {
    topDescribes[i].style.display = '';
  }
})();
