/*
 *  HTMLElement.prototype.settings:
 *  Exposes the current attributes of an element as
 *  members on an object that can be bound/mapped to
 *
 *  Usage:
 *  <div data-settings-disabled="model.boolean.value"></div>
 *
 *  Example:
 *  var element = document.createElement('div');
 *  element.settings.test = true; // equiv to element.setAttribute('test', 'test');
 *  element.settings['hyphenated-attribute'] = 'value'; // equiv to element.setAttribute('hyphenated-attribute', 'value')
 *  element.settings.removed = false; // equiv to element.removeAttribute('removed')
 *
 *  Result:
 *  <div test="test" hyphenated-attribute="value"></div>
 */
Object.defineProperty(HTMLElement.prototype, 'settings', {
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
