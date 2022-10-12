/**
* @component:     Extension - HTMLInputElement.prototype.autosize
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
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
    target.style.width = '0px';
    target.style.width = `${target.scrollWidth}px`;
    target.dispatchEvent(new AutoSizeEvent());
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
