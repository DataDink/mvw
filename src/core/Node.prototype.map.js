(() => {
  /**
  * The index for caching to the node
  * @constant {Symbol} QueryCacheIndex
  */
  const QueryCacheIndex = Symbol(' _querycache_ '); // Index for caching queries to Nodes
  let Lib = // For minification
  /**
  *  Extends Node with a method that maps values from a model to a node
  *  and its descendants accepting a model and a optional configuration
  * @function map
  * @param {object} model - The data to map to the node and its descendants
  * @param {object} config - The settings for this mapping
  * @returns {Node} - The mapped node
  */
  Node.prototype.map = // For global
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
    var cache = node[QueryCacheIndex] || (node[QueryCacheIndex] = {}); // Query cache
    Array.from(node.attributes || [])
      .forEach(attribute => {
        if (attribute.name.indexOf(scope.attributePrefix) !== 0) { return; }
        var viewQuery = cache[attribute.name.toLowerCase()] || (cache[attribute.name.toLowerCase()] = // Get or create the attribute query
          new MemberQuery(
            Lib.repath(node, attribute.name, scope),
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
