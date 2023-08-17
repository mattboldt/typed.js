(function(){
  if (location.protocol === 'file:') {
    let elms = document.querySelectorAll('a[href="./"]');
    for (let i = 0; i < elms.length; i++) {
      elms[i].href = './index.html';
    }
  }
})();
