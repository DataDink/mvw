/**
* @dependencies:  MVW.js
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Compliment to the HTMLElement.hidden property
*/


((ExtensionPoint, ExtensionName) => {
  if (ExtensionName in ExtensionPoint) { return; }

  /**
  * @member {bool} shown - Inverse property of HTMLElement.prototype.hidden
  */
  Object.defineProperty(HTMLElement.prototype, 'shown', {
    configurable: false, enumerable: true,
    get: function() { return !this.hidden; },
    set: function(value) { this.hidden = !value; }
  });
})(
  /** @ExtensionPoint */ HTMLElement.prototype,
  /** @ExtensionName  */ 'shown'
);
