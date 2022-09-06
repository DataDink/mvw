(() => {
  let Lib = // To help with minification
  /** Deserializes a string to a value
  * @function deserialize
  * @param {String} content - The serialized content
  * @param {Object} config - configures the deserialization
  */
  Object.deserialize = function deserialize(content, config = null) {
    config = new Lib.Config(content, config);
    return Lib.parse(config);
  }
  /** Recursive function for parsing values
  * @function parse
  * @param {Object} config - configures the deserialization
  */
  Lib.parse = function parse(config) {
    config.trim();
    var type = config.source[config.index];
    if (type === '[') { return Lib.array(config); }
    if (type === '{') { return Lib.object(config); }
    if (type === '"') { return Lib.string(config); }
    if (type === "'") { return Lib.string(config); }
    return Lib.constant(config);
  }
  /** Parses an array
  * @function array
  * @param {Object} config - configures the deserialization
  */
  Lib.array = function array(config) {
    var array = [];
    config.index++;
    config.catalog.push(array);
    config.trim();
    while (config.index < config.source.length && config.source[config.index] !== ']') {
      array.push(Lib.parse(config));
      config.delim();
    }
    config.index++;
    return array;
  }
  /** Parses an object
  * @function object
  * @param {Object} config - configures the deserialization
  */
  Lib.object = function object(config) {
    config.index++;
    config.trim();
    if (config.source[config.index] === '}') { return {}; }
    var instance = Lib.initializer(config);
    while (config.index < config.source.length && config.source[config.index] !== '}') {
      var key = Lib.key(config);
      var value = Lib.parse(config);
      instance[key] = value;
      config.delim();
    }
    config.index++;
    return instance;
  }
  /** Parses an object initializer and creates an instance
  * @function initializer
  * @param {Object} config - configures the deserialization
  */
  Lib.initializer = function initializer(config) {
    var instance = null;
    var key = Lib.key(config);
    if (key === config.refKey) {
      instance = config.catalog[Lib.parse(config)];
    } else if (key === config.typeKey) {
      config.catalog.push(instance = config.parseType(Lib.parse(config)));
    } else {
      config.catalog.push(instance = {});
      instance[key] = Lib.parse(config);
    }
    config.delim();
    return instance;
  }
  /** Parses an object member key
  * @function key
  * @param {Object} config - configures the deserialization
  */
  Lib.key = function key(config) {
    var name = Lib.string(config);
    config.delim();
    return name;
  }
  /** Parses a string
  * @function string
  * @param {Object} config - configures the deserialization
  */
  Lib.string = function string(config) {
    var term = config.source[config.index];
    var start = config.index++;
    while (config.index < config.source.length && config.source[config.index] !== term) {
      if (config.source[config.index++] === '\\') {
        config.index++;
      }
    }
    var content = config.source.substring(start, ++config.index);
    return JSON.parse(content);
  }
  /** Parses a constant value
  * @function constant
  * @param {Object} config - configures the deserialization
  */
  Lib.constant = function constant(config) {
    var start = config.index;
    config.index = String.scanUntil(config.source, ' \t\r\n,]}', start);
    config.index = config.index === -1 ? config.source.length : config.index;
    return JSON.parse(config.source.substring(start, config.index));
  }
  /**
  * @class {Config}
  * @param {String} source - The string being parsed
  * @param {Object} overrides - Override configuration values
  */
  Lib.Config = class Config {
    /** @member {String} refKey - The member name used to note an instance reference */
    refKey = '*';
    /** @member {String} typeKey - The member name used to note an object's class */
    typeKey = ':';
    /** @member {String} whitespace - The characters to be recognized as whitespace */
    whitespace = ' \t\r\n';
    /** The strategy for resolving a type for construction
    * @function parseType
    * @param {String} value - The value to be parsed.
    */
    parseType = function parseType(value) {
      if (!/^[0-9a-z@$#\.]+$/i.test(value)) { return {}; }
      try { return new (eval(value))(); }
      catch { return {}; }
    }
    constructor(source, overrides = null) {
      Object.override(this, overrides);
      this.source = source;
      this.index = 0;
      this.catalog = [];
      this.delimspace = ',:' + this.whitespace;
      this.trim = () => {
        this.index = String.scanWhile(this.source, this.whitespace, this.index);
        return this.index === -1 ? (this.index = this.source.length) : this.index;
      }
      this.delim = () => {
        this.index = String.scanWhile(this.source, this.delimspace, this.index);
        return this.index === -1 ? (this.index = this.source.length) : this.index;
      }
    }
  }
})();
