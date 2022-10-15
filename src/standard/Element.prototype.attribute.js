/**
* @component:     Extension - Element.prototype.attribute
* @product:       MVW - A micro extension framework
* @dependencies:  MVW.js
* @documentation: https://github.com/DataDink/mvw/wiki
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         A binding-friendly alternative to Element.prototype.attributes
*/

MVW.conflictGuard('attribute' in HTMLElement.prototype);

/**
* @constant {Symbol} Index - The index for caching to the element
*/
let Index = Symbol('attribute');

/**
* @property {Proxy} attribute - Wrapper object converting has/get/set attribute methods into true/false member assignments
*/
Object.defineProperty(Element.prototype, 'attribute', {
  enumerable: true, configurable: false,
  get: function() {
    return this[Index] || (this[Index] = ((element) =>
      new Proxy({}, {
        has: (_, name) => element.hasAttribute(name),
        get: (_, name) => element.hasAttribute(name) ? element.getAttribute(name) : false,
        set: (_, name, value) => (value !== false)
          ? element.setAttribute(name, value === true ? name : `${value}`) || true
          : element.removeAttribute(name) || true,
        ownKeys: () => Array.from(element.attributes).map(a => a.localName)
      })
    )(this));
  }
});
