(() => {
  /** @constant {Symbol} Cleanup - caching index for elements belonging to the template */
  const Cleanup = Symbol(' _template cleanup_ ');
  /** @constant {Symbol} Data - caching index for the data model assigned to the template */
  const Data = Symbol(' _template model_ ');
  /** @member {object} template - Extends HTMLTemplateElement with the template property */
  Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
    configurable: false, enumerable: false,
    get: function() { return this[Data]; },
    set: function(value) {
      this[Data] = value; // cache
      if (Cleanup in this) { this[Cleanup](); } // cleanup previous content
      if (!this.parentNode) { return; } // No place to add content
      var configuration = (Node.Scope.continue(this)||{}).overrides; // Persist configuration to new scopes
      var content = (Array.isArray(value) ? value : [value])
        .filter(v => v != null) // don't create elements for these
        .map(model => this.content.cloneNode(true).map(model, configuration)) // create view
        .flatMap(fragment => Array.from(fragment.childNodes)); // extract elements
      this[Cleanup] = () => { // Configure cleanup
        content.forEach(e => e.parentNode && e.parentNode.removeChild(e));
        delete this[Cleanup];
      };
      this.parentNode.insertBefore( // Insert view content
        content.reduce((frag,node) => frag.appendChild(node)&&frag, document.createDocumentFragment()),
        this.nextSibling
      )
    }
  });
})();
