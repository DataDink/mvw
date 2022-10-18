if (Object.getPrototypeOf(EventTarget.prototype)!==Object.prototype) {
  Object.setPrototypeOf(EventTarget.prototype, Object.prototype);
}
require('../dst/debug/mvw.extended.js');
