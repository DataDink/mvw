(() => {
  /**
  * The index for caching to the node
  * @constant {Symbol} CacheIndex
  */
  const CacheIndex = Symbol('cached-queries'); // Index for caching queries to Nodes
  let Lib = // For minification
  /**
  *  Extends Node with a method that maps values from a model to a node
  *  and its descendants accepting a model and a optional configuration
  * @function map
  * @param {object} model - The data to map to the node and its descendants
  * @param {object} config - The settings for this mapping
  * @returns {Node} - The mapped node
  */
  Node.prototype.map = // Global extension
  function map(model, config = null) { // Init scope and pass to recursive func
    var scope = Node.Scope.continue(this) || Node.Scope.create(this, config);
    return Lib.mapNode(this, model, scope);
  };
  /**
  *  The recursive mapper called from Node.prototype.map
  * @function mapNode
  * @param {Node} node - The node being mapped
  * @param {object} model - The data being mapped to the node
  * @param {object} config - The settings for the mapping
  * @returns {Node} - The mapped node
  */
  Lib.mapNode = function(node, model, scope) {
    if (scope !== Node.Scope.continue(node)) { return node; } // Reached another mapping scope
    var cache = node[CacheIndex] || (node[CacheIndex] = []); // Query cache
    Array.from(node.attributes || [])
      .forEach(attribute => {
        if (attribute.name.indexOf(scope.attributePrefix) !== 0) { return; }
        var name = attribute.name.toLowerCase().trim();
        var viewQuery = cache[name] || (cache[name] = // Get or create the attribute query
          new MemberQuery(Lib.repath(node, name, scope), scope.queryConfig)
        );
        var selector = attribute.value.trim();
        var modelQuery = cache[selector] || (cache[selector] = // Get or create the model query
          new MemberQuery(selector, scope.queryConfig)
        );
        var oldValue = viewQuery.get(node);
        var newValue = modelQuery.get(model);
        var requiresUpdate = typeof(newValue) === 'object' || oldValue !== newValue;
        if (!requiresUpdate) { return; }
        viewQuery.set(node, newValue);
      });
    Array.from(node.childNodes)
         .forEach(child => Lib.mapNode(child, model, scope));
    return node;
  };
  /**
  *  Search a node for a case insensitive matching matching an attribute name
  * @function repath
  * @param {Node} node - The node being queried
  * @param {object} model - The attribute name
  * @param {Node.Scope} scope - The scope configuration
  * @returns {string} - The reconstructed selector
  */
  Lib.repath = function(node, attribute, scope) {
    return attribute
    .substr(scope.attributePrefix.length) // dump prefix
    .split(scope.attributeDelimiter) // split
    .map(member => { // find case-insensitive matching path
      if (node != null && !(member in node)) {
        var normal = member.toLowerCase(); // normalize casing
        for (var name in node) {
          if (normal === name.toLowerCase()) {
            member = name;
            break;
          }
        }
      }
      node = node == null ? null : node[member];
      return member; // default original casing
    }).join(scope.queryConfig.memberDelimiter); // rejoin with memberDelimiter
  };
})();
