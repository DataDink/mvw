(() => {
  /**
  * The index for caching to the node
  * @constant {Symbol} Index
  */
  let Index = Symbol('attribute');
  /** @member {Proxy} attribute - Wrapper object converting has/get/set attribute methods into true/false member assignments */
  Object.defineProperty(Element.prototype, 'attribute', {
    configurable: false, enumerable: true,
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
})();
