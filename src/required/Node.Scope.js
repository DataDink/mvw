/*
 *  Node.Scope:
 *  Configures the mapping scope for a node and its descendants.
 *
 *  Usage:
 *  Node.Scope.create((Node)node[], (object)overrides])
 *  Node.Scope.continue((Node)node[, (object)overrides])
 *
 *  Example:
 *  var session = Node.Scope.create(document.body);
 */
Node.Scope = class { // Configuration scope assignable to a Node
  attributePrefix = 'data-'; // The prefix used to identify mapping attributes
  attributeDelimiter = '-'; // The character that delineats members in an attribute name
  constructor(overrides = {}) {
    overrides = Object.assign({}, overrides || {});
    Object.keys(this).forEach(member => { // Apply overrides to this
      if (member in overrides) { this[member] = overrides[member]; }
    });
    this.overrides = overrides;
    this.queryConfig = new MemberQuery.Config(overrides); // Cache config for models
    Object.freeze(this); // Lockdown scope
    Object.freeze(overrides);
  }
  static #Index = Symbol(' _mapdata_ '); // Cached to the configured node
  static create(node, overrides = null) { // Start a new scope at the node
    return node[Node.Scope.#Index] = new Node.Scope(overrides);
  }
  static continue(node, overrides = null) { // Retrieves the node's or inherits the parentNode's scope
    return node[Node.Scope.#Index] || (
      node[Node.Scope.#Index] = (node.parentNode && node.parentNode[Node.Scope.#Index])
    );
  }
};
