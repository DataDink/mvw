/**
* @dependencies:  MVW.js
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Element.prototype.querySelector but for members on objects.
*/

((ExtensionPoint, ExtensionName, Delim) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @function memberSelector - Extension to select and\or assign object members
  * @parameter {string} selector - The member selector
  * @parameter {any} assign - The optional value to assign
  * @returns {any} - The value queried or assigned
  */
  const Query = function memberSelector(selector, assign = null) { return Configure(null, this, ...arguments); };

  /**
  * @function configure - Executes a member selector with override settings
  * @parameter {object} settings - The override settings
  * @parameter {object} target - The object to be queried
  * @parameter {string} selector - The member selector
  * @parameter {any} assign - The optional value to assign
  * @returns {any} - The value selected or assigned
  */
  const Configure = Query.configure = Object.freeze(function configure(settings, target, selector, assign) {
    var delim = MVW.Settings.get(Delim, settings);
    var {source, member, complete} = Select(target, selector, delim);
    if (!complete||source==null) { return; }
    return arguments.length < 4 ? source[member] : source[member]=assign;
  });

  /**
  * @function select - Resolves the source & member for member selector
  * @parameter {object} target - The object to query
  * @parameter {string} selector - The member selector
  * @parameter {string} delim - The selector delimiter
  * @returns {source, member} - The source and member resolved by the selector
  */
  const Select = Query.select = Object.freeze(function select(target, selector, delim) {
    var names = `${selector}`.split(delim);
    for (
      var i=0,source=target,l=names.length-1;
      i<l&&source!=null&&source[names[i]]!=null;
      source=source[names[i++]]
    ) {}
    return {source, member: names[i], complete: i===l};
  });

  Object.defineProperty(ExtensionPoint, ExtensionName, {
    enumerable: true, writable: false, configurable: false,
    value: Object.freeze(Query)
  });
})(
  /** @ExtensionPoint */ Object.prototype,
  /** @ExtensionName  */ 'memberSelector',
  /** @Delim          */ MVW.Settings.register('memberDelim', '.')
);
