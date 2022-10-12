/**
* @component:     Extension - Element.prototype.attribute
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
*/

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
          ? element.setAttribute(name, value === true ? name : (value == null ? '' : value)) || true
          : element.removeAttribute(name) || true,
        ownKeys: () => Array.from(element.attributes).map(a => a.name)
      })
    )(this));
  }
});
