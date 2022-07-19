(() => {
  /** @constant {Symbol} Content - caching index for elements belonging to the template */
  const Content = Symbol('template-content');
  /** @constant {Symbol} Data - caching index for the data model assigned to the template */
  const Data = Symbol('template-data');
  /** @member {object} template - Extends HTMLTemplateElement with the template property */
  Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
    configurable: false, enumerable: false,
    get: function() { return this[Data]; },
    set: function(value) {
      this[Data] = value; // for the getter
      var content = this[Content] ?? (this[Content]=[]);
      if (value == null || !this.parentNode) {
        content.forEach(c => c.forEach(e => e.parentNode && e.parentNode.removeChild(e)));
        return;
      }
      var configuration = (Node.Scope.continue(this)||{}).overrides;
      var bindings = (typeof(value) === 'object' && Symbol.iterator in value
        ? Array.from(value)
        : [value]).filter(v => v != null);
      for (var i = 0; i < bindings.length && i < content.length; i++) { // remap existing
        content[i].forEach(element => element.map(bindings[i]));
      }
      while (content.length > bindings.length) { // remove excess
        content.pop().forEach(element => element.parentNode && element.parentNode.removeChild(element));
      }
      for (var i = content.length; i < bindings.length; i++) { // add new items
        var insert = (i > 0 ? content[i-1][0] ?? this : this).nextSibling;
        var elements = Array.from(this.content.cloneNode(true).map(bindings[i], configuration).childNodes);
        content.push(elements);
        elements.forEach(element => this.parentNode.insertBefore(element, insert));
      }
    }
  });
})();
