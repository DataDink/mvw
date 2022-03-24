/*
 *  Element.prototype.attribute:
 *  Exposes the current attributes of an element as
 *  members on an object that can be bound/mapped to
 *
 *  Usage:
 *  <div data-attribute-disabled="model.boolean.value"></div>
 *
 *  Example:
 *  var element = document.createElement('div');
 *  element.attribute.test = true; // equiv to element.setAttribute('test', 'test');
 *  element.attribute['hyphenated-attribute'] = 'value'; // equiv to element.setAttribute('hyphenated-attribute', 'value')
 *  element.attribute.removed = false; // equiv to element.removeAttribute('removed')
 *
 *  Result:
 *  <div test="test" hyphenated-attribute="value"></div>
 */
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
