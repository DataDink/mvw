Node.Scope = // global extension
/**
* Configures the mapping scope for a node and its descendants.
* @class {Scope}
* @param {object} overrides - Configuration settings
*/
class Scope {
  /** @constant {Symbol} Index - Mapping cache node index */
  static #Index = Symbol('mapping-scope');
  /** @member {string} attributePrefix - The prefix used to identify mapping attributes */
  attributePrefix = 'data-';
  /** @member {string} attributeDelimiter - The character that delineats members in an attribute name */
  attributeDelimiter = '-';
  constructor(overrides = {}) {
    this.overrides = Object.assign({}, overrides || {});
    this.queryConfig = new MemberQuery.Config(this.overrides); // Cache config for models
    Object.override(this, this.overrides);
    Object.freeze(this); // Lockdown scope
    Object.freeze(this.overrides);
  }
  /**
  * Configures a node with a new scope
  * @function create
  * @param {Node} node - The node being scoped
  * @param {object} overrides - Configuration settings
  * @returns {Node.Scope} The created scope
  */
  static create(node, overrides = null) { // Start a new scope at the node
    return node[Scope.#Index] = new Scope(overrides);
  }
  /**
  * Configures a node with its parent scope (if any)
  * @function continue
  * @param {Node} node - The node being scoped
  * @param {object} overrides - Configuration settings
  * @returns {Node.Scope} The scope configured to the node (new when no parent scope)
  */
  static continue(node, overrides = null) { // Retrieves the node's or inherits the parentNode's scope
    return node[Scope.#Index] || (
      node[Scope.#Index] = (node.parentNode && node.parentNode[Scope.#Index])
    );
  }
};
