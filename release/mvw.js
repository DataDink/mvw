(() => {
/*
 *  Node.prototype.map:
 *  Extends Node with a map method accepting an object that will
 *  map values from the model to properties on the elements based
 *  on attribute configurations on the elements
 *
 *  Usage:
 *  <span data-property="model.value"></span>
 *
 *  Example:
 *  var element = document.createElement('span');
 *  element.setAttribute('data-textContent', 'value'); // equiv to element.textContent = model.value
 *  element.map({value: 'test'});
 *
 *  Result:
 *  <span data-textContent="value">test</span>
 */
(() => {
  const Prefix = /^data\-/i;
  const Scope = Symbol(' _mapping scope_ ');
  Node.prototype.map = function(model) {
    var view = this;
    var scope = arguments[1] || view[Scope] || (view[Scope] = {});
    if (scope !== (view[Scope] || (view[Scope] = scope))) { return; }
    Array.from(view.attributes || [])
         .filter(attribute => Prefix.test(attribute.name))
         .forEach(attribute => {
           var modelQuery = new ObjectQuery(model, attribute.value, false);
           var value = typeof(modelQuery.value) === 'function'
             ? modelQuery.value.bind(modelQuery.binding)
             : modelQuery.value;
           var elementSelector = attribute.name.replace(Prefix, '').replace(/\-+/g, '.');
           var elementQuery = new ObjectQuery(view, elementSelector, true);
           elementQuery.value = value;
         });
    Array.from(view.childNodes)
         .forEach(node => node.map(model, scope));
    return view;
  }
})();

/*
 *  ObjectQuery:
 *  Executes a selector query on an object and provides a
 *  value getter/setter along with additional details about
 *  the result of the query.
 *
 *  Usage:
 *  new ObjectQuery((object)object, (string)selector[, (bool)matchExistingCase])
 *
 *  Example:
 *  var query = new ObjectQuery({member1: {member2: 123}}, 'member1.member2');
 *  JSON.stringify(query);
 *
 *  Result:
 *  {
 *    "complete": true,
 *    "binding": {"member2": 123},
 *    "property": "member2",
 *    "value": 123
 *  }
 */
class ObjectQuery {
  complete;
  binding;
  property;
  get value() { if (this.complete) { return this.binding[this.property]; } }
  set value(value) { if (this.complete) { this.binding[this.property] = value; } }
  constructor(object, selector, matchExistingCase = false) {
    var query = Array.from(selector.matchAll(/[^\.]+/g)).map(match => match[0]);
    while (object != null && query.length) {
      this.property = matchExistingCase
        ? ObjectQuery.#matchMemberCase(object, query.shift())
        : query.shift();
      object = (this.binding = object)[this.property];
    }
    this.complete = !query.length && this.binding != null;
  }
  static #matchMemberCase(object, name) {
    if (name in object) { return name; }
    var lower = name.toLowerCase();
    while (object != null) {
      var match = Object.getOwnPropertyNames(object)
        .find(m => m.toLowerCase() === lower);
      if (match != null) { return match; }
      object = Object.getPrototypeOf(object);
    }
    return name;
  }
}

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

/*
 *  HTMLTemplateElement.prototype.template:
 *  Exposes a binding/mapping member on HTMLTemplateElements
 *  that will render objects & arrays of objects to the DOM
 *  immediately after itself
 *
 *  Usage:
 *  <template data-template="model.array.value"></template>
 *
 *  Example:
 *  var parent = document.createElement('div');
 *  var template = parent.appendChild(document.createElement('template'));
 *  template.innerHTML = '<span data-textContent="value"></span>';
 *  template.template = [
 *    {value: 'a'},
 *    {value: 'b'},
 *    {value: 'c'}
 *  ];
 *
 *  Result:
 *  <div>
 *    <template><span data-textContent="value"></span></template>
 *    <span data-textContent="value">a</span>
 *    <span data-textContent="value">b</span>
 *    <span data-textContent="value">c</span>
 *  </div>
 */
(() => {
  const Cleanup = Symbol(' _template cleanup_ ');
  Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
    configurable: false, enumerable: false,
    get: function() { return this.content.cloneNode(true); },
    set: function(value) {
      var element = this;
      if (Cleanup in element) { element[Cleanup](); }
      if (!element.parentNode) { return; }
      var content = (Array.isArray(value) ? value : [value])
        .filter(v => v != null)
        .map(model => element.template.map(model))
        .flatMap(fragment => Array.from(fragment.childNodes));
      element[Cleanup] = () => {
        content.forEach(e => e.parentNode && e.parentNode.removeChild(e));
        delete element[Cleanup];
      };
      element.parentNode.insertBefore(
        content.reduce((frag,node) => frag.appendChild(node)&&frag, document.createDocumentFragment()),
        element.nextSibling
      )
    }
  });
})();
})();