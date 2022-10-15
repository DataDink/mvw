/**
* @component:     Extension - HTMLInputElement.prototype.autosize
* @product:       MVW - A micro extension framework
* @dependencies:  MVW.js
* @documentation: https://github.com/DataDink/mvw/wiki
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Adds styling functionality to inputs similar to inline-block
*/

/**
* @const {string} AttributeName - The autosize attribute's name
*/
const AttributeName = 'autosize';

/**
* @const {string} EventName - The custom autosize event name
*/
const EventName = 'autosize';

/**
* @const {Symbol} SpamBlock - The spam-block index
*/
const SpamBlock = Symbol('spam-blocker');

/**
* @class {CustomEvent} AutoSizeEvent - The custom autosize event type
*/
class AutoSizeEvent extends Event {
  constructor() {
    super(EventName, {
      bubbles: true,
      cancelable: true,
      composed: false
    });
  }
  static handler(e) {
    var target = e&&e.target||this;
    if (SpamBlock in target) { return; }
    target[SpamBlock] = true;

    var restoreWidth = target.style.width;
    target.style.width = '0px';
    target.style.width = `${target.scrollWidth}px`;
    if (target.style.width === '0px') { target.style.width = restoreWidth; }

    var restoreHeight = target.style.height;
    target.style.height = '0px';
    target.style.height = `${target.scrollHeight}px`;
    if (target.style.height === '0px') { target.style.height = restoreHeight; }

    target.dispatchEvent(new AutoSizeEvent());
    delete target[SpamBlock];
  }
}

/**
* @const {Array<string>} TriggerEvents - The triggering events for an autosize event
*/
const TriggerEvents = ['input', 'change', 'focus', 'blur', 'paste'];

/**
* @hook {MutationObserver} document - Hooks into the dom to listen for autosize attribute mutations
*/
new MutationObserver(records => {
  records.forEach(record => {
    var elements = record.type === 'childList'
      ? Array.from(record.addedNodes||[])
          .filter(n => n instanceof Element)
          .flatMap(e => [e, ...(e.querySelectorAll(`[${AttributeName}]`)||[])])
      : [record.target];
    for (var element of elements) {
      TriggerEvents.forEach(name => element.removeEventListener(name, AutoSizeEvent.handler));
      if (!element.hasAttribute(AttributeName)) { return; }
      TriggerEvents.forEach(name => element.addEventListener(name, AutoSizeEvent.handler));
      AutoSizeEvent.handler.call(element);
    }
  });
})
.observe(document, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [AttributeName]
});
