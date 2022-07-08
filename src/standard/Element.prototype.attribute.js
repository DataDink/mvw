/** @member {Proxy} attribute - Wrapper object converting has/get/set attribute methods into true/false member assignments */
Object.defineProperty(Element.prototype, 'attribute', {
  configurable: false, enumerable: true,
  get: function() {
    var element = this;
    return new Proxy({}, {
      has: (_, name) => element.hasAttribute(name),
      get: (_, name) => element.hasAttribute(name) ? element.getAttribute(name) : false,
      set: (_, name, value) => (value != null && value !== false)
        ? element.setAttribute(name, value === true ? name : value) || true
        : element.removeAttribute(name) || true,
      ownKeys: () => Array.from(element.attributes).map(a => a.name)
    });
  }
});
