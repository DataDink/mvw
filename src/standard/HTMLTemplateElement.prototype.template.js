/**
* @component:     Extension - HTMLTemplateElement.prototype.template
* @product:       MVW - A micro extension framework
* @dependencies:  MVW.js
* @documentation: https://github.com/DataDink/mvw/wiki
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Extends basic binding functionality to have
*                 content-generation capabilities
*/

MVW.conflictGuard('template' in HTMLTemplateElement.prototype);

/**
* @constant {Symbol} Content - caching index for elements belonging to the template
*/
const Content = Symbol('template-content');

/**
* @constant {Symbol} Data - caching index for the data model assigned to the template
*/
const Data = Symbol('template-data');

/**
* @member {object} template - Extends HTMLTemplateElement with the template property
*/
const Template = Object.defineProperty(HTMLTemplateElement.prototype, 'template', {
  configurable: false, enumerable: false,
  get: function() { return this[Data]; },
  set: function(value) {
    this[Data] = value; // for the getter
    var content = this[Content] || (this[Content]=[]);
    var settings = this.bind.settings(this);
    var bindings = value == null ? []
      : typeof(value) === 'object' && Symbol.iterator in value ? Array.from(value)
      : [value];
    for (var i = 0; i < bindings.length && i < content.length; i++) { // rebind existing
      content[i].forEach(element => element.bind.configure(settings, bindings[i]));
    }
    while (content.length > bindings.length) { // remove excess
      content.pop().forEach(element => element.parentNode && element.parentNode.removeChild(element));
    }
    for (var i = content.length; i < bindings.length; i++) { // add new items
      var sibling = content[content.length - 1];
      var insert = (sibling ? sibling[sibling.length - 1] : this).nextSibling;
      var fragment = this.content.cloneNode(true);
      fragment.bind.configure(settings, bindings[i]);
      var elements = Array.from(fragment.childNodes);
      content.push(elements);
      elements.forEach(element => this.parentNode.insertBefore(element, insert));
    }
  }
});
