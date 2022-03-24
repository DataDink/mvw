/*
 *  Element.prototype.class:
 *  Exposes the current classList of an element as boolean
 *  members on an object that can be bound/mapped to
 *
 *  Usage:
 *  <div data-class-test="model.boolean.value"></div>
 *
 *  Example:
 *  var element = document.createElement('div');
 *  element.class.test = true; // equiv to element.classList.add('test')
 *  element.class['hyphenated-class'] = true; // equiv to element.classList.add('hyphenated-class')
 *  element.class.removed = false; // equiv to element.classList.remove('removed')
 *
 *  Result:
 *  <div class="test hyphenated-class"></div>
 */
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
