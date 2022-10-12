/**
* @component:     Extension - HTMLInputElement.prototype.autosize
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
*/

MVW.conflictGuard('promise' in EventTarget.prototype);

/**
* @const {string} Pass - Setting for pass events
*/
const Pass = MVW.Settings.register('successEvents', Object.freeze(['success', 'complete', 'done', 'load', 'ready', 'pass']));

/**
* @const {string} Fail - Setting for fail events
*/
const Fail = MVW.Settings.register('failureEvents', Object.freeze(['error', 'reject', 'fail']));

/**
* @function promise - Creates a promise that listens for success & error events
* @parameter {any} resolve - The event or array of events that should resolve the Promise
* @parameter {any} reject - The event or array of events that should reject the Promise
*/
Object.defineProperty(EventTarget.prototype, 'promise', {
  enumerable: true, writable: false,
  value: function(resolve, reject) {
    return new Promise((pass, fail) => {
      var handlers = [
        {key:Pass, override: resolve, callback: pass},
        {key:Fail, override: reject, callback: fail}
      ].flatMap(setup => (
        !setup.override ? MVW.Settings.get(setup.key)
        : typeof(setup.override) === 'string' ? [setup.override]
        : Symbol.iterator in setup.override ? Array.from(setup.override)
        : [`${setup.override}`]
      ).map(name => { return {
        name: name,
        handler: () => {
          handlers.forEach(h => this.removeEventListener(h.name, h.handler));
          setup.callback(this);
        }
      }}));
      for (var handler of handlers) { this.addEventListener(handler.name, handler.handler); }
    });
  }
});
