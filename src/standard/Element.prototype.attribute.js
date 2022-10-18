/**
* @dependencies:  n/a
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         A binding-friendly alternative to Element.prototype.attributes
*/

((ExtensionPoint, ExtensionName, Index) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @property {Proxy} attribute - Wrapper object converting has/get/set attribute methods into true/false member assignments
  */
  Object.defineProperty(ExtensionPoint, ExtensionName, {
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
})(
  /** @ExtensionPoint */ Element.prototype,
  /** @ExtensionName  */ 'attribute',
  /** @Index          */ Symbol('attribute')
);
