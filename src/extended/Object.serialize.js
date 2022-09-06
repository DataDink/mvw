(() => {
  let Lib = // To help with minification
  /**
  * Serializes an object into a JSON-esque format that supports instance referencing and type mapping
  * @function serialize
  * @param {Object} object - The object to be serialized
  * @param {Object} config - configuration options
  * @returns {String} - The serialized object
  */
  Object.serialize = function serialize(object, config = null) {
    config = new Lib.Config(config);
    return Lib.format(object, config);
  }
  /**
  * Recursive value serialization formatting
  * @function format
  * @param {any} value - The value to be formatted
  * @param {Object.serialize.Config} config - The configuration for the serialization
  * @returns {String} - The serialized value
  */
  Lib.format = function format(value, config) {
    if (typeof(value) === 'function') { return JSON.stringify(config.formatFunction(value)); }
    if (!(value instanceof Object)) { return JSON.stringify(value); }
    var index = config.catalog.indexOf(value);
    if (index >= 0) {
      return `{${Lib.member(config.refKey, index, config)}}`;
    }
    config.catalog.push(value);
    var isArray = Array.isArray(value);
    var prefix = isArray ? '[' : '{';
    var content = isArray
      ? value.map(v => Lib.format(v, config))
      : [Lib.member(config.typeKey, config.formatType(value), config)]
        .concat(
          Array.from(Lib.fields(value))
          .map(m => Lib.member(m, value[m], config))
        );
    var suffix = isArray ? ']' : '}';
    return `${prefix}${content.join(',')}${suffix}`;
  }
  /**
  * Iterates an object's serializable fields
  * @function fields
  * @param {Object} obj - The object to iterate
  * @returns {iterator} - The iterator
  */
  Lib.fields = function *fields(obj) {
    for (var member in obj) {
      if (obj[member] == null || typeof(obj[member]) === 'function') { continue; }
      yield member;
    }
  }
  /**
  * Formats an object member
  * @function member
  * @param {String} name - The member name
  * @param {any} value - The object value
  * @param {Object.serialize.Config} config - The configuration for serialization
  * @returns {String} - A formatted name/value
  */
  Lib.member = function member(name, value, config) {
    return `${JSON.stringify((name||'').toString())}:${Lib.format(value, config)}`;
  }
  /**
  * Configuration for object serialization
  * @class {Config}
  * @param {Object} overrides - override configuration values
  */
  Lib.Config = class Config {
    /** @member {string} refKey - The member name to denote an instance reference */
    refKey = '*';
    /** @member {string} typeKey - The member name to denote a class reference */
    typeKey = ':';
    /**
    * The strategy for serializing an object's type
    * @function formatType
    * @param {Object} v - The instance value
    * @returns {String} - A formatted value
    */
    formatType = function formatType(v) { return v.constructor.name; }
    /**
    * The strategy for serializing a function value
    * @function formatFunction
    * @param {Function} f - The function to be serialized
    * @returns {String} - A formatted value
    */
    formatFunction = function formatFunction(f) { return `function ${f.name}() {}`; }
    constructor(overrides) {
      Object.override(this, overrides);
      this.catalog = [];
    }
  }
})();
