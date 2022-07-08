/** @member {Proxy} class - Wrapper object converting the Element.classList array into true/false member assignment */
Object.defineProperty(Element.prototype, 'class', {
  configurable: false, enumerable: true,
  get: function() {
    var element = this;
    return new Proxy({}, {
      has: (_, name) => element.classList.contains(name),
      get: (_, name) => element.classList.contains(name),
      set: (_, name, value) => (element.classList.remove(name) || !!value && element.classList.add(name)) || true,
      ownKeys: () => Array.from(element.classList),
    });
  }
});
