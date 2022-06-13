/*
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
