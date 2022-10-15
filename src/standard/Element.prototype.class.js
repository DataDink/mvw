/**
* @component:     Extension - Element.prototype.class
* @product:       MVW - A micro extension framework
* @dependencies:  MVW.js
* @documentation: https://github.com/DataDink/mvw/wiki
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         A binding-friendly alternative to Element.prototype.classList
*/

MVW.conflictGuard('class' in HTMLElement.prototype);

/**
* @constant {Symbol} Index - The index for caching to the node
*/
let Index = Symbol('class');

/**
* @member {Proxy} class - Wrapper object converting the Element.classList array into true/false member assignment
*/
Object.defineProperty(Element.prototype, 'class', {
  configurable: false, enumerable: true,
  get: function() {
    return this[Index] || (this[Index] = ((element) =>
      new Proxy({}, {
        has: (_, name) => element.classList.contains(name),
        get: (_, name) => element.classList.contains(name),
        set: (_, name, value) => (element.classList.remove(name) || !!value && element.classList.add(name)) || true,
        ownKeys: () => Array.from(element.classList),
      })
    )(this));
  }
});
