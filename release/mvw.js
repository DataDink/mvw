console.log("https://github.com/DataDink/mvw v1.1.0");
(() => {/*
 *  MemberQuery:
 *  Compiles a query that can be executed on an object
 *  to get or set a descendant member value.
 *
 *  Usage:
 *  new MemberQuery((string)selector[, (MemberQuery.Config)config])
 *  (MemberQuery).get((object)object)
 *  (MemberQuery).set((object)object, (any)value)
 *
 *  Example:
 *  let test = { member1: { member2: 123 }, func(a, b) { console.log(a, b); } }
 *  let query = new MemberQuery('member1.member2');
 *  console.log(query.resolve(test));
 *
 *  Results:
 *  123
 */
(function() { return this; })().MemberQuery =
class MemberQuery {
  #config;
  #path = []; // The member chain to the binding
  #params = []; // Parameter selectors
  #property = ''; // The value member on the binding
  constructor(selector, config = MemberQuery.Config.Default) {
    this.#config = config;
    var start = MemberQuery.trim(selector, 0, config.trimCharacters); // Trim to selector
    var index = MemberQuery.until(selector, start, config.pathTerminators); // Trim to delim
    this.#path = selector.substring(start, index).split(config.memberDelimiter); // Read path from start to index
    this.#property = this.#path.pop(); // Breakout final member from path (support for MemberQuery.set(...))
    index = MemberQuery.trim(selector, index, config.trimCharacters); // Trim to delim
    while (index < selector.length && selector[index++] !== config.selectorTerminator) { // Read parameter selectors
      start = MemberQuery.trim(selector, index, config.trimCharacters); // Trim to param
      index = MemberQuery.until(selector, start, config.paramTerminators); // Move to param end
      this.#params.push(selector.substring(start, index).split(config.memberDelimiter)); // Add to list
      index = MemberQuery.trim(selector, index, config.trimCharacters); // Trim to delim
    }
  }
  get(object) {
    object = MemberQuery.walk(object, this.#path); // Read to the binding object
    if (object == null) { return; } // Break if no binding object
    var value = object[this.#property]; // The value
    if (typeof(value) !== 'function') { return value; } // Return non-function value
    if (!this.#params.length) { return value.bind(object); } // Return bound function if no parameters need to be resolved
    return ((params) => function() { return value.apply( // Return parameter resolving function
      object, // Bind call to the method owner
      params.map(param => MemberQuery.walk(this, param)) // Bind querries to the method caller
    );})(this.#params);
  }
  set(object, value) {
    object = MemberQuery.walk(object, this.#path); // Read to the binding object
    if (object == null) { return; } // Brea if no binding object
    object[this.#property] = value; // Set the value
  }
  static walk(object, members) { // Walk descendant members of an object
    for (var i = 0; object != null && i < members.length; i++) {
      object = object[members[i]];
    }
    return object;
  }
  static trim(selector, index, characters) { // Advances past characters
    while(index < selector.length && characters.indexOf(selector[index]) >= 0) { index++; }
    return index;
  }
  static until(selector, index, characters) { // Advances to the first of characters
    while (++index < selector.length && characters.indexOf(selector[index]) < 0) {}
    return index;
  }
  static Config = class Config { // Customizes selector parsing
    memberDelimiter = '.'; // The character that delineats members in a selector
    selectorDelimiter = '('; // The character that delineats the start of parameter selectors
    parameterDelimiter = ','; // The character that delineats parameter selectors
    selectorTerminator = ')'; // The character that terminates parameter selectors
    trimCharacters = ' \t\r\n'; // The characters that will be treated as whitespace
    constructor(overrides = {}) {
      overrides = Object.assign({}, overrides || {});
      Object.keys(this).forEach(prop => { // only set members that this class already has defaults for
        if (prop in overrides) { this[prop] = overrides[prop]; }
      });
      this.pathTerminators = this.selectorDelimiter + this.trimCharacters; // precombine conjunctions for performance
      this.paramTerminators = this.parameterDelimiter + this.selectorTerminator + this.trimCharacters;
      Object.freeze(this);
    }
    static #defaultConfig;
    static get Default() { return MemberQuery.Config.#defaultConfig || (MemberQuery.Config.#defaultConfig = new MemberQuery.Config()); }
  }
}

/*
 *  Node.Scope:
 *  Configures the mapping scope for a node and its descendants.
 *
 *  Usage:
 *  Node.Scope.create((Node)node[], (object)overrides])
 *  Node.Scope.continue((Node)node[, (object)overrides])
 *
 *  Example:
 *  var session = Node.Scope.create(document.body);
 */
Node.Scope = class { // Configuration scope assignable to a Node
  attributePrefix = 'data-'; // The prefix used to identify mapping attributes
  attributeDelimiter = '-'; // The character that delineats members in an attribute name
  constructor(overrides = {}) {
    overrides = Object.assign({}, overrides || {});
    Object.keys(this).forEach(member => { // Apply overrides to this
      if (member in overrides) { this[member] = overrides[member]; }
    });
    this.overrides = overrides;
    this.queryConfig = new MemberQuery.Config(overrides); // Cache config for models
    Object.freeze(this); // Lockdown scope
    Object.freeze(overrides);
  }
  static #Index = Symbol(' _mapdata_ '); // Cached to the configured node
  static create(node, overrides = null) { // Start a new scope at the node
    return node[Node.Scope.#Index] = new Node.Scope(overrides);
  }
  static continue(node, overrides = null) { // Retrieves the node's or inherits the parentNode's scope
    return node[Node.Scope.#Index] || (
      node[Node.Scope.#Index] = (node.parentNode && node.parentNode[Node.Scope.#Index])
    );
  }
};

/*
 *  Node.prototype.map:
 *  Extends Node with a method that maps values from a model to a node
 *  and its descendants accepting a model and a optional configuration
 *
 *  Usage:
 *  <node data-property="model.value"></node>
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
  const QueryCacheIndex = Symbol(' _querycache_ '); // Index for caching queries to Nodes
  Node.prototype.map = function map(model, config = null) { // Init scope and pass to recursive func
    var scope = Node.Scope.continue(this) || Node.Scope.create(this, config);
    return Node.prototype.map.mapNode(this, model, scope);
  };
  Node.prototype.map.mapNode = function(node, model, scope) { // Recursively maps a Node hierarchy matching the scope
    if (scope !== Node.Scope.continue(node)) { return node; } // Reached another mapping scope
    var cache = node[QueryCacheIndex] || (node[QueryCacheIndex] = {}); // Query cache
    Array.from(node.attributes || [])
      .forEach(attribute => {
        if (attribute.name.indexOf(scope.attributePrefix) !== 0) { return; }
        var viewQuery = cache[attribute.name.toLowerCase()] || (cache[attribute.name.toLowerCase()] = // Get or create the attribute query
          new MemberQuery(
            Node.prototype.map.repath(node, attribute.name, scope),
            scope.queryConfig
          )
        );
        var modelQuery = cache[attribute.value] || (cache[attribute.value] = // Get or create the model query
          new MemberQuery(
            attribute.value,
            scope.queryConfig
          )
        );
        viewQuery.set(node, modelQuery.get(model)); // Apply the mapping
      });
    Array.from(node.childNodes)
         .forEach(child => Node.prototype.map.mapNode(child, model, scope));
    return node;
  };
  Node.prototype.map.repath = function(node, attribute, scope) { // Search a node for a case insensitive matching path
    return attribute
    .substr(scope.attributePrefix.length) // dump prefix
    .split(scope.attributeDelimiter) // split
    .map(member => { // find case-insensitive matching path
      if (!(member in node)) {
        var search = node;
        var normal = member.toLowerCase(); // normalize casing
        while (search) {
          var match = Object.keys(search).find(m => m.toLowerCase() === normal); // find match
          if (match != null) { // return if match
            member = match;
            break;
          }
          search = Object.getPrototypeOf(search); // search prototype
        }
      }
      node = node[member];
      return member; // default original casing
    }).join(scope.queryConfig.memberDelimiter); // rejoin with memberDelimiter
  };
})();

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
  const Cleanup = Symbol(' _template cleanup_ '); // caching elements belonging to the template
  const Data = Symbol(' _template model_ '); // caching the data model assigned to the template
  Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
    configurable: false, enumerable: false,
    get: function() { return this[Data]; },
    set: function(value) {
      this[Data] = value; // cache
      if (Cleanup in this) { this[Cleanup](); } // cleanup previous content
      if (!this.parentNode) { return; } // No place to add content
      var configuration = (Node.Scope.continue(this)||{}).overrides; // Persist configuration to new scopes
      var content = (Array.isArray(value) ? value : [value])
        .filter(v => v != null) // don't create elements for these
        .map(model => this.content.cloneNode(true).map(model, configuration)) // create view
        .flatMap(fragment => Array.from(fragment.childNodes)); // extract elements
      this[Cleanup] = () => { // Configure cleanup
        content.forEach(e => e.parentNode && e.parentNode.removeChild(e));
        delete this[Cleanup];
      };
      this.parentNode.insertBefore( // Insert view content
        content.reduce((frag,node) => frag.appendChild(node)&&frag, document.createDocumentFragment()),
        this.nextSibling
      )
    }
  });
})();})();