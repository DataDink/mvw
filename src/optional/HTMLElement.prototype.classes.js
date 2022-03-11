/*
 *  HTMLElement.prototype.classes:
 *  Exposes the current classList of an element as boolean
 *  members on an object that can be bound/mapped to
 *
 *  Usage:
 *  <div data-classes-test="model.boolean.value"></div>
 *
 *  Example:
 *  var element = document.createElement('div');
 *  element.classes.test = true; // equiv to element.classList.add('test')
 *  element.classes['hyphenated-class'] = true; // equiv to element.classList.add('hyphenated-class')
 *  element.classes.removed = false; // equiv to element.classList.remove('removed')
 *
 *  Result:
 *  <div class="test hyphenated-class"></div>
 */
Object.defineProperty(HTMLElement.prototype, 'classes', {
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
