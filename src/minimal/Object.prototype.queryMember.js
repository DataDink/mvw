/**
* @component:     Extension - Object.prototype.queryMember
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
*/

/**
* @const {string} Delim - The delimiter used when parsing member selectors
*/
const Delim = MVW.Settings.register('memberDelim', '.');

/**
* @const {bool} Casing - Specifies if member queries are case-sensitive
*/
const Casing = MVW.Settings.register('memberCasing', true);

/**
* @const {reference} Getter - Specifies the passed value should not be set to the query
*/
const Getter = MVW.Settings.register('nonAssignment', null);

/**
* @function Object.prototype.queryMember - Extension to query and set object members
* @parameter {string} selector - The member selector
* @parameter {any} assign - Optional a value to assign or MVM.Settings.unassign to delete
* @parameter {object} config - Optional override configuration
* @returns {any} - The value queried or assigned
*/
Object.defineProperty(Object.prototype, 'queryMember', {
  enumerable: true, configurable: false,
  value: Object.freeze(
    function queryMember(selector, assign = null, config = null) {
      var delim = MVW.Settings.get(Delim, config);
      var casing = MVW.Settings.get(Casing, config);
      var names = `${selector}`.split(delim);
      for (
        var i=0,source=this,l=names.length-1;
        i<l&&source;
        (source=source[casing ? names[i++] : find(source, names[i++])])
      ) {}
      if (source == null) { return; }
      var member = casing ? names[i] : find(source, names[i]);
      var getter = arguments.length < 2 || assign === MVW.Settings.get(Getter, config);
      return getter ? source[member] : source[member] = assign;
    }
  )
});

/**
* @function find - Searches an object for a matching case-insensitive member
* @parameter {object} source - The object to search
* @parameter {string} name - The member to search for
* @returns {string} - The first matching member or original name searched for
*/
function find(source, name) {
  var match = name.toLowerCase();
  while (source != null) {
    for (var member in source) {
      if (member.toLowerCase() === match) {
        return member;
      }
    }
    source = Object.getPrototypeOf(source);
  }
  return name;
}
