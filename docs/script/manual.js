(function(){
  let matched = location.pathname.match(/\/(manual\/.*\.html)$/);
  if (!matched) return;

  let currentName = matched[1];
  let cssClass = '.navigation .manual-toc li[data-link="' + currentName + '"]';
  let styleText = cssClass + '{ display: block; }\n';
  styleText += cssClass + '.indent-h1 a { color: #039BE5 }';
  let style = document.createElement('style');
  style.textContent = styleText;
  document.querySelector('head').appendChild(style);
})();
