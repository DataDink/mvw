/**
* @component:     Extension - Node.prototype.map
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
*/

MVW.conflictGuard('map' in HTMLElement.prototype);

/**
* @const {Symbol} MapIndex - The index used to cache to an node
*/
const MapIndex = Symbol('mvw');

/**
* @const {string} BindingDelim - Configuration key for the binding delimiter value
*/
const BindingDelim = MVW.Settings.register('bindingDelim', '-');

/**
* @const {string} BindingPrefix - Configuration key for binding attributes' prefix
*/
const BindingPrefix = MVW.Settings.register('bindingPrefix', 'bind-');

/**
* @function map - Maps a model to the node and its descendants
* @parameter {object} model - The optional model to map
* @parameter {object} config - The optional override configuration for this mapping
* @returns {object} - The current configuration/scope for the node
*/
Object.defineProperty(Node.prototype, 'map', {
  enumerable: true, writable: false,
  value: Object.freeze(
    function map(model = null, config = null) {
      // Resolve the configuration for this mapping
      if (config != null) { this[MapIndex] = Object.freeze({
        model: Object.freeze(MVW.Settings.export(config)),
        node: Object.freeze(MVW.Settings.export(config, {
          memberDelim: MVW.Settings.get(BindingDelim, config),
          memberCasing: false
        }))
      });}
      config = this[MapIndex] || (this[MapIndex] = this.parentNode&&this.parentNode[MapIndex]);
      if (config == null) { return this.map(model, {}); }
      if (model == null) { return config.model; }

      // Apply the map to this node
      if (this instanceof Element) {
        var prefix = config.model[BindingPrefix];
        for (var attr of this.getAttributeNames()) {
          if (attr.indexOf(prefix) !== 0) { continue; }
          var binding = attr.substr(prefix.length);
          var query = this.getAttribute(attr).split('(', 2);
          var value = model.queryMember(query[0], config.model.nonAssignment, config.model);
          var params = query.length > 1 ? query[1].split(')',2)[0].split(',') : null;
          this.queryMember(
            binding,
            typeof(value) === 'function'
              ? ((func,model,elem,args) => function() {
                  return func.apply(model, args ? args.map(p => elem.queryMember(p)) : arguments)
                })(value, model, this, params)
              : value,
            config.node
          );
        }
      }

      // Recurse child nodes
      for (var i=0, children=Array.from(this.childNodes), l=children.length; i<l; ++i) {
        if ((children[i][MapIndex] || config) === config) { children[i].map(model); }
      }

      return config.model;
    }
  )
});

/**
* @function findMember - Finds an existing case-insensitive member on the target object
* @parameter {object} target - The target object to search
* @parameter {string} member - The member name to search for
* @returns {string} - The existing case-insensitive member if exists or the original member search value
*/
function findMember(target, member) {
  if (member in target) { return member; }
  member = member.toLowerCase();
  for (var base = target; base != null; base = Object.getPrototypeOf(base)) {
    for (var name in base) {
      if (name.toLowerCase() === member) { return member; }
    }
  }
  return member;
}
