/**
* @component:     Extension - Element[autosize].js
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
* @const {Array<string>} TriggerEvents - The triggering events for an autosize event
*/
const TriggerEvents = ['input', 'paste'];

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
    if (!target.hasAttribute(AttributeName)) { return; }
    
    var restoreWidth = target.style.width;
    target.style.width = '0px';
    target.style.width = `${target.scrollWidth}px`;
    if (target.style.width === '0px') { target.style.width = restoreWidth; }

    var restoreHeight = target.style.height;
    target.style.height = '0px';
    target.style.height = `${target.scrollHeight}px`;
    if (target.style.height === '0px') { target.style.height = restoreHeight; }

    target.dispatchEvent(new AutoSizeEvent());
  }
}

/**
* @hook {MutationObserver} document - Hooks into the dom to listen for autosize attribute mutations
*/
new MutationObserver(records => {
  records.forEach(record => {
    subscribe(record.type === 'childList'
      ? Array.from(record.addedNodes||[])
      : [record.target]
    );
  });
})
.observe(document, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [AttributeName],
});

/**
* @function subscribe - configures the handlers for the element and its descendants
*/
function subscribe(elements) {
  elements.filter(e => e instanceof Element)
          .flatMap(e => [e, ...e.querySelectorAll(`[${AttributeName}]`)])
          .forEach(e => {
            TriggerEvents.forEach(name => e.removeEventListener(name, AutoSizeEvent.handler));
            if (!e.hasAttribute(AttributeName)) { return; }
            TriggerEvents.forEach(name => e.addEventListener(name, AutoSizeEvent.handler));
            AutoSizeEvent.handler.call(e);
          });
}
subscribe([document.body]);
