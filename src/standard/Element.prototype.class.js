(() => {
  /**
  * The index for caching to the node
  * @constant {Symbol} Index
  */
  let Index = Symbol('class');
  /** @member {Proxy} class - Wrapper object converting the Element.classList array into true/false member assignment */
  Object.defineProperty(Element.prototype, 'class', {
    configurable: false, enumerable: true,
    get: function() {
      return this[Index] || (this[Index] = ((element) =>
        new Proxy({}, {
          has: (_, name) => element.classList.contains(name),
          get: (_, name) => element.classList.contains(name),
          set: (_, name, value) => (element.classList.remove(name) || !!value && element.classList.add(name)) || true,
          ownKeys: () => Array.from(element.classList),
        })
      )(this));
    }
  });
})();
