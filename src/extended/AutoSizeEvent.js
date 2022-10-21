/**
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Adds js driven content sizing functionality
*                 similar to inline-block for Elements (e.g. HTMLInputElement)
*/

((ExtensionPoint, ExtensionName, AttrName, EvtName, Triggers) => {
  Object.defineProperty(ExtensionPoint, ExtensionName, {
    enumerable: true, configurable: false, writable: false,
    value: Object.freeze(
      /**
      * @class {CustomEvent} AutoSizeEvent - The custom autosize event type
      */
      class AutoSizeEvent extends Event {
        constructor() {
          super(EvtName, {
            bubbles: true,
            cancelable: true,
            composed: false
          });
        }
        /**
        * @function trigger - Triggers an autosize event on an element
        * @parameter {Event} e - The triggering event details
        */
        static trigger(e) {
          var target = e&&e.target||this;
          if (!target.hasAttribute(AttrName)) { return; }

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
        /**
        * @function subscribe - Subscribes listeners to the elements
        * @parameter {Array<Element>} elements - The elements to subscribe to
        */
        static subscribe(elements) {
          elements.filter(e => e instanceof Element)
                  .forEach(e => {
                    Triggers.forEach(name => {
                      e.removeEventListener(name, AutoSizeEvent.trigger);
                      e.addEventListener(name, AutoSizeEvent.trigger);
                    });
                    AutoSizeEvent.trigger.call(e);
                  });
        }
      })
  });

  /**
  * @hook {MutationObserver} document - Listens for new elements to subscribe to
  * @todo: Use Attribute mutations: Was unable to get the removal publication working
  */
  new MutationObserver(records => {
    records.forEach(record => {
      AutoSizeEvent.subscribe(
        Array.from(record.addedNodes||[]).flatMap(n => [n, ...n.getElementsByTagName('*')])
      );
    });
  })
  .observe(document, {
    childList: true,
    subtree: true
  });
  AutoSizeEvent.subscribe(Array.from(document.getElementsByTagName('*')));

})(
  /** @ExtensionPoint */ Object.getPrototypeOf((function() { return this; })()),
  /** @ExtensionName  */ 'AutoSizeEvent',
  /** @AttrName       */ 'autosize',
  /** @EvtName        */ 'autosize',
  /** @Triggers       */ ['input', 'paste']
);
