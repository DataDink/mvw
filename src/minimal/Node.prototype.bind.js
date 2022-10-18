/**
* @dependencies:  MVW.js, Object.prototype.memberSelector.js
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Primary goal of MVW: Separation of View/App.
*/

((ExtensionPoint, ExtensionName, BindIndex, BindDelim, BindPrefix) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @function bind - Binds a model to the node and its descendants
  * @parameter {object} model - The model to bind
  * @returns {Node} - The root node of the binding
  */
  const Bind = function bind(model) { return Configure(null, this, ...arguments); };

  /**
  * @function configure - Executes a binding with override settings
  * @parameter {object} settings - The override settings
  * @parameter {Node} node - The root node to bind
  * @parameter {object} model - The model to bind
  * @returns {Node} - The root node of the binding
  */
  const Configure = Bind.configure = Object.freeze(function(settings, node, model) {
    if (!(settings = Settings(node, settings)||Settings(node, {}))) { return node; }
    if ('attributes' in node) {
      var prefix = settings[BindPrefix];
      var delim = settings[BindDelim];
      for (var attr of Array.from(node.attributes)) {
        var {binding, member:binder, complete} = Binding(attr, prefix, delim);
        if (!complete || binding == null) { continue; }
        var query = attr.value.split('(', 2);
        var {source, member, complete} = Object.prototype.memberSelector.select(model, query[0], settings.memberDelim);
        var value = !complete||source==null ? undefined : source[member];
        if (typeof(value)==='function') {
          value = ((func, context, args, index, config) => function() {
            return func.apply(context, args.length
              ? args.map(s=>Object.prototype.memberSelector.configure(config,index,s))
              : arguments
            );
          })(value, source, (query.length>1?query[1].split(')')[0].split(',').map(s=>s.trim()):[]), node, settings);
        }
        binding[binder] = value;
      }
    }

    if ('childNodes' in node) {
      for (var child of Array.from(node.childNodes)) {
        var scope = Settings(child);
        if (scope && scope !== settings) { continue; }
        child.bind(model);
      }
    }

    return node;
  });

  /**
  * @function settings - resolves bind settings for the Node
  * @parameter {Node} node - The node
  * @parameter {object} overrides - Overrides the current settings for the node
  * @returns {object} - The resolved settings object for the node.
  */
  const Settings = Bind.settings = Object.freeze(function settings(node, overrides = null) {
    if (!(node instanceof Node)) { return; }
    if (overrides != null) { return node[BindIndex] = Object.freeze(MVW.Settings.export(overrides)); }
    if (BindIndex in node) { return node[BindIndex]; }
    if (node.parentNode&&(BindIndex in node.parentNode)) { return node[BindIndex] = node.parentNode[BindIndex]; }
  });

  /**
  * @function binding - Resolves the binding for an Attr
  * @parameter {Attr} attr - The Attr to resolve
  * @parameter {string} prefix - The bindingPrefix setting to use
  * @parameter {string} delim - The bindingDelim setting to use
  * @returns {binding, member} - The binding information
  */
  const Binding = Bind.binding = Object.freeze(function binding(attr, prefix, delim) {
    if (!(attr instanceof Attr)||attr.localName.indexOf(prefix) !== 0) { return {complete: false}; }
    var binding=attr.ownerElement, members=attr.localName.substr(prefix.length).split(delim);
    for (
      var i=0,l=members.length-1,member=Member(binding, members[0]);
      i<l&&binding!=null&&binding[member]!=null;
      (binding=binding[member])&&0||(member=Member(binding,members[++i]))
    ) {}
    return {binding, member, complete: i===l};
  });

  /**
  * @function member - Resolves a case-insensitive member name on the object
  * @parameter {object} obj - The object to search
  * @parameter {string} search - The member name to search for
  * @returns {string} - The resolved name
  */
  const Member = Bind.member = Object.freeze(function member(source, search) {
    search = `${search}`;
    if (source!==null&&typeof(source)==='object'&&search in source) { return search; }
    var match, trim=search.trim(), lower=trim.toLowerCase();
    while (source != null) {
      for (var name of Object.getOwnPropertyNames(source)) {
        if (name === search || name === trim) { return name; }
        if ((match = name.trim()) === trim) { return name; }
        if ((match = match.toLowerCase()) === lower) { return name; }
      }
      source = Object.getPrototypeOf(source);
    }
    return search;
  });

  Object.defineProperty(ExtensionPoint, ExtensionName, {
    enumerable: true, configurable: false, writable: false,
    value: Object.freeze(Bind)
  });
})(
  /** @ExtensionPoint */ Node.prototype,
  /** @ExtensionName  */ 'bind',
  /** @BindIndex      */ Symbol('binding'),
  /** @BindDelim      */ MVW.Settings.register('bindingDelim', '-'),
  /** @BindPrefix     */ MVW.Settings.register('bindingPrefix', 'bind-')
);
