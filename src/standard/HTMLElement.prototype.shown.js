/** @member {bool} shown - Inverse property of HTMLElement.prototype.hidden */
Object.defineProperty(HTMLElement.prototype, 'shown', {
  configurable: false, enumerable: true,
  get: function() { return !this.hidden; },
  set: function(value) { this.hidden = !value; }
});
