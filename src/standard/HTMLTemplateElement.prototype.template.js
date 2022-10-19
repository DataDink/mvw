/**
* @dependencies:  MVW.js
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Extends basic binding functionality to have
*                 content-generation capabilities
*/

((ExtensionPoint, ExtensionName, Content, Data) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @member {object} template - Extends HTMLTemplateElement with the template property
  */
  const Template = Object.defineProperty(ExtensionPoint, ExtensionName, {
    configurable: false, enumerable: false,
    get: function() { return this[Data]; },
    set: function(value) {
      this[Data] = value;
      var settings = Node.prototype.bind.settings(this);
      var content = this[Content] || (this[Content]=[]);
      var bindings = value == null ? []
        : typeof(value) === 'object' && Symbol.iterator in value ? Array.from(value)
        : [value];
      for (var i=0; i < bindings.length && i < content.length; i++) { // rebind existing
        content[i].forEach(node => Node.prototype.bind.configure(null, node, bindings[i]));
      }
      while (content.length > bindings.length) { // remove excess
        content.pop().forEach(node => node.parentNode && node.parentNode.removeChild(node));
      }
      for (var i = content.length; i < bindings.length; i++) { // add new items
        var sibling = content[content.length - 1];
        var insert = (sibling ? sibling[sibling.length - 1] : this).nextSibling;
        var fragment = this.content.cloneNode(true);
        Node.prototype.bind.configure(settings, fragment, bindings[i]);
        var nodes = Array.from(fragment.childNodes);
        content.push(nodes);
        nodes.forEach(node => this.parentNode.insertBefore(node, insert));
      }
    }
  });

})(
  /** @ExtensionPoint */ HTMLTemplateElement.prototype,
  /** @ExtensionName  */ 'template',
  /** @Content        */ Symbol('template-content'),
  /** @Data           */ Symbol('template-data')
);
