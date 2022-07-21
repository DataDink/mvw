(() => {
  /**
  * The index for caching to the node
  * @constant {Symbol} Index
  */
  let Index = Symbol('autosize');
  /**
  * The index for caching to the node
  * @function handler - The thing that does stuff
  */
  function handler() {
    this.style.width = 0;
    this.style.width = this.scrollWidth + 'px';
  }
  /** @member {bool} autosize - enables auto-resizing the element to fit content */
  Object.defineProperty(HTMLInputElement.prototype, 'autosize', {
    configurable: false, enumerable: true,
    get: function() { return this[Index] || false; },
    set: function(value) {
      this[Index] = value !== false;
      this.removeEventListener('input', handler);
      this.removeEventListener('focus', handler);
      if (value === false) { return true; }
      this.addEventListener('input', handler);
      this.addEventListener('focus', handler);
      setTimeout(handler.bind(this));
      return true;
    }
  });
})();
