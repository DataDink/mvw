/**
* @component:     Extension - HTMLElement.prototype.shown
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
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
