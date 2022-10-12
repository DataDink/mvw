if (!window.MVW) {
  Object.setPrototypeOf(EventTarget.prototype, Object.prototype); // Jest's jsdom needs this correction
  require('../dst/debug/mvw.extended.js');
}
