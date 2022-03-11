/*
 *  HTMLTemplateElement.prototype.template:
 *  Exposes a binding/mapping member on HTMLTemplateElements
 *  that will render objects & arrays of objects to the DOM
 *  immediately after itself
 *
 *  Usage:
 *  <template data-template="model.array.value"></template>
 *
 *  Example:
 *  var parent = document.createElement('div');
 *  var template = parent.appendChild(document.createElement('template'));
 *  template.innerHTML = '<span data-textContent="value"></span>';
 *  template.template = [
 *    {value: 'a'},
 *    {value: 'b'},
 *    {value: 'c'}
 *  ];
 *
 *  Result:
 *  <div>
 *    <template><span data-textContent="value"></span></template>
 *    <span data-textContent="value">a</span>
 *    <span data-textContent="value">b</span>
 *    <span data-textContent="value">c</span>
 *  </div>
 */
(() => {
  const Cleanup = Symbol(' _template cleanup_ ');
  Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
    configurable: false, enumerable: false,
    get: function() { return this.content.cloneNode(true); },
    set: function(value) {
      var element = this;
      if (Cleanup in element) { element[Cleanup](); }
      if (!element.parentNode) { return; }
      var content = (Array.isArray(value) ? value : [value])
        .filter(v => v != null)
        .map(model => element.template.map(model))
        .reverse()
        .flatMap(fragment => Array.from(fragment.childNodes));
      element[Cleanup] = () => {
        content.forEach(e => e.parentNode && e.parentNode.removeChild(e));
        delete element[Cleanup];
      };
      content.forEach(e => element.parentNode.insertBefore(e, element.nextSibling))
    }
  });
})();
