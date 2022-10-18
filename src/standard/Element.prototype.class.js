/**
* @dependencies:  n/a
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         A binding-friendly alternative to Element.prototype.classList
*/

((ExtensionPoint, ExtensionName, Index) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @member {Proxy} class - Wrapper object converting the Element.classList array into true/false member assignment
  */
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
})(
  /** @ExtensionPoint */ Element.prototype,
  /** @ExtensionName  */ 'class',
  /** @Index          */ Symbol('class')
);
