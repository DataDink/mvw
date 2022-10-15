/**
* @component:     Extension - HTMLElement.prototype.shown
* @product:       MVW - A micro extension framework
* @dependencies:  MVW.js
* @documentation: https://github.com/DataDink/mvw/wiki
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Compliment to the HTMLElement.hidden property
*/

MVW.conflictGuard('shown' in HTMLElement.prototype);

/**
* @member {bool} shown - Inverse property of HTMLElement.prototype.hidden
*/
Object.defineProperty(HTMLElement.prototype, 'shown', {
  configurable: false, enumerable: true,
  get: function() { return !this.hidden; },
  set: function(value) { this.hidden = !value; }
});
