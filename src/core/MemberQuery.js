(function() { return this; })().MemberQuery = // global
/**
*  Compiles a query that can be executed on an object
*  to get or set a descendant member value.
* @class MemberQuery
* @param {String} selector - A selector string that points to a descendant value on an object
* @param {MemberQuery.Config} config - Configures how the query will function
*/
class MemberQuery {
  /** @member {MemberQuery.Config} config - The config for this MemberQuery */
  #config;
  /** @member {Array} path - The member chain to the binding */
  #path = [];
  /** @member {Array} params - Parameter selectors */
  #params = [];
  /** @member {String} property - The value member on the binding */
  #property = '';
  constructor(selector, config = MemberQuery.Config.Default) {
    this.#config = config;
    var start = String.scan(selector, config.trimCharacters, 0, true); // Trim to selector
    if (start === -1) { return ''; }
    var index = String.scan(selector, config.pathTerms, start, false); // Trim to delim
    this.#path = selector.substring(start, index === -1 ? selector.length : index)
                         .split(config.memberDelimiter); // Read path from start to index
    this.#property = this.#path.pop(); // Breakout final member from path (support for MemberQuery.set(...))
    index = String.scan(selector, config.pathTerms, index++, true); // Trim to param or bust
    while (index !== -1) { // Read parameter selectors
      index = String.scan(selector, config.paramTerms, start=index, false); // Move to param end
      index = index === -1 ? selector.length : index;
      this.#params.push(selector.substring(start, index).split(config.memberDelimiter)); // Add to list
      index = String.scan(selector, config.paramTerms, index, true); // Trim to next or bust
    }
  }
  /**
  *  Executes this query on an object
  * @function get
  * @param {Object} object - The object
  * @returns {varies} - The descendant value or default if the path does not exist
  */
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
  /**
  *  Sets a value on this object using the query
  * @function set
  * @param {Object} object - The object
  * @param {varies} value - The value
  */
  set(object, value) {
    object = MemberQuery.walk(object, this.#path); // Read to the binding object
    if (object == null) { return; } // Brea if no binding object
    object[this.#property] = value; // Set the value
  }
  /**
  *  Walks an object's descendants using an array of member names
  * @function walk
  * @param {Object} object - The object
  * @param {Array} members - The member names
  * @returns {varies} - The descendant value or default if the path does not exist
  */
  static walk(object, members) { // Walk descendant members of an object
    for (var i = 0; object != null && i < members.length; i++) {
      object = object[members[i]];
    }
    return object;
  }
  /**
  *  Customizes selector parsing
  * @constructor MemberQuery.Config
  * @param {object} overrides - Default configuration overrides
  */
  static Config = class Config {
    /** @member {String} memberDelimiter - The character that delineats members in a selector */
    memberDelimiter = '.';
    /** @member {String} selectorDelimiter - The character that delineats the start of parameter selectors */
    selectorDelimiter = '(';
    /** @member {String} parameterDelimiter - The character that delineats parameter selectors */
    parameterDelimiter = ',';
    /** @member {String} selectorTerminator - The character that terminates parameter selectors */
    selectorTerminator = ')';
    /** @member {String} trimCharacters - The characters that will be treated as whitespace */
    trimCharacters = ' \t';
    constructor(overrides = {}) {
      Object.override(this, overrides);
      this.pathTerms = this.selectorDelimiter + this.trimCharacters + this.selectorTerminator; // precombine conjunctions for performance
      this.paramTerms = this.parameterDelimiter + this.selectorTerminator + this.trimCharacters;
      Object.freeze(this);
    }
    /** @member {MemberQuery.Config} defaultConfig - The default configuration */
    static #defaultConfig;
    /** @member {MemberQuery.Config} Default - The default configuration */
    static get Default() { return MemberQuery.Config.#defaultConfig || (MemberQuery.Config.#defaultConfig = new MemberQuery.Config()); }
  }
};
