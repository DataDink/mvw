/*
 *  Node.prototype.map:
 *  Extends Node with a method that maps values from a model to a node
 *  and its descendants accepting a model and a optional configuration
 *
 *  Usage:
 *  <node data-property="model.value"></node>
 *
 *  Example:
 *  var element = document.createElement('span');
 *  element.setAttribute('data-textContent', 'value'); // equiv to element.textContent = model.value
 *  element.map({value: 'test'});
 *
 *  Result:
 *  <span data-textContent="value">test</span>
 */
(() => {
  const QueryCacheIndex = Symbol(' _querycache_ '); // Index for caching queries to Nodes
  Node.prototype.map = function map(model, config = null) { // Init scope and pass to recursive func
    var scope = Node.Scope.continue(this) || Node.Scope.create(this, config);
    return Node.prototype.map.mapNode(this, model, scope);
  };
  Node.prototype.map.mapNode = function(node, model, scope) { // Recursively maps a Node hierarchy matching the scope
    if (scope !== Node.Scope.continue(node)) { return node; } // Reached another mapping scope
    var cache = node[QueryCacheIndex] || (node[QueryCacheIndex] = {}); // Query cache
    Array.from(node.attributes || [])
      .forEach(attribute => {
        if (attribute.name.indexOf(scope.attributePrefix) !== 0) { return; }
        var viewQuery = cache[attribute.name.toLowerCase()] || (cache[attribute.name.toLowerCase()] = // Get or create the attribute query
          new MemberQuery(
            Node.prototype.map.repath(node, attribute.name, scope),
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
         .forEach(child => Node.prototype.map.mapNode(child, model, scope));
    return node;
  };
  Node.prototype.map.repath = function(node, attribute, scope) { // Search a node for a case insensitive matching path
    return attribute
    .substr(scope.attributePrefix.length) // dump prefix
    .split(scope.attributeDelimiter) // split
    .map(member => { // find case-insensitive matching path
      if (!(member in node)) {
        var search = node;
        var normal = member.toLowerCase(); // normalize casing
        while (search) {
          var match = Object.keys(search).find(m => m.toLowerCase() === normal); // find match
          if (match != null) { // return if match
            member = match;
            break;
          }
          search = Object.getPrototypeOf(search); // search prototype
        }
      }
      node = node[member];
      return member; // default original casing
    }).join(scope.queryConfig.memberDelimiter); // rejoin with memberDelimiter
  };
})();
