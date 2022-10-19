/**
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Converts from event-based asynchronous patterns to promises/async/await
*/

((ExtensionPoint, ExtensionName, PassEvents, FailEvents) => {
  if (ExtensionName in ExtensionPoint) { return; }
  Object.defineProperty(ExtensionPoint, ExtensionName, {
    enumerable: true, writable: false,
    value: Object.freeze(
      /**
      * @function promise - Creates a promise that listens for success & error events
      * @parameter {any} resolve - The event or array of events that should resolve the Promise
      * @parameter {any} reject - The event or array of events that should reject the Promise
      */
      function promise(resolve, reject) {
        return new Promise((pass, fail) => {
          var handlers = [
            {key:PassEvents, override: resolve, callback: pass},
            {key:FailEvents, override: reject, callback: fail}
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
    )
  });
})(
  /** @ExtensionPoint */ EventTarget.prototype,
  /** @ExtensionName  */ 'promise',
  /** @PassEvents     */ MVW.Settings.register('successEvents', Object.freeze(['success', 'complete', 'done', 'load', 'ready', 'pass'])),
  /** @FailEvents     */ MVW.Settings.register('failureEvents', Object.freeze(['error', 'reject', 'fail']))
);
