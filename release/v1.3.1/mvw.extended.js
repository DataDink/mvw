console.info("https:github.com/DataDink/mvw/release/v1.3.1/mvw.extended.js");

(MVWDEBUGBUILDIDENTIFIER => {
    const MVWGLOBALROOTMEMBER = function() {
        return this;
    }();
    const Object = MVWGLOBALROOTMEMBER.Object;
    const Node = MVWGLOBALROOTMEMBER.Node;
    const Element = MVWGLOBALROOTMEMBER.Element;
    const HTMLElement = MVWGLOBALROOTMEMBER.HTMLElement;
    const EventTarget = MVWGLOBALROOTMEMBER.EventTarget;
    const Symbol = MVWGLOBALROOTMEMBER.Symbol;
    const Array = MVWGLOBALROOTMEMBER.Array;
    const Attr = MVWGLOBALROOTMEMBER.Attr;
    const Promise = MVWGLOBALROOTMEMBER.Promise;
    const RegExp = MVWGLOBALROOTMEMBER.RegExp;
    const Proxy = MVWGLOBALROOTMEMBER.Proxy;
    const Event = MVWGLOBALROOTMEMBER.Event;
    function MVWAPPLYEXTENSION(target, name, config) {
        return Object.defineProperty(target, name, Object.assign(config, {
            enumerable: true,
            configurable: false
        }));
    }
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     MVW
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/MVW
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/MVW.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         The goal here is to provide disassociated coordination across modules
*/
        ((ExtensionPoint, ExtensionName) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze(class MVW {
                    static Settings=Object.freeze(class Settings {
                        static #reg={};
                        static register(name, initial) {
                            name = `${name}`;
                            if (name in Settings.#reg) {
                                throw `Setting '${name}' is already registered`;
                            }
                            Settings.#reg[name] = initial;
                            return name;
                        }
                        static get(name, overrides = null) {
                            name = `${name}`;
                            if (!overrides || typeof overrides !== "object" || !(name in overrides)) {
                                return Settings.#reg[name];
                            }
                            return overrides[name];
                        }
                        static export(...overrides) {
                            return overrides.filter((or => or != null)).reduce(((ex, or) => Object.keys(or).filter((name => name in ex)).forEach((name => ex[name] = or[name])) && ex || ex), Object.assign({}, Settings.#reg));
                        }
                    });
                })
            });
        })(Object.getPrototypeOf(function() {
            return this;
        }()), "MVW");
    })("src/core/MVW.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     Node.prototype.bind
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/Node.prototype.bind
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/Node.prototype.bind.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js, Object.prototype.memberSelector.js
* @notes:         Primary goal of MVW: Separation of View/App.
*/
        ((ExtensionPoint, ExtensionName, BindIndex, BindDelim, BindPrefix) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            const Bind = function bind(model) {
                return Configure(null, this, ...arguments);
            };
            const Configure = Bind.configure = Object.freeze((function(settings, node, model) {
                if (!(settings = Settings(node, settings) || Settings(node, {}))) {
                    return node;
                }
                if ("attributes" in node) {
                    var prefix = settings[BindPrefix];
                    var delim = settings[BindDelim];
                    for (var attr of Array.from(node.attributes)) {
                        var {binding: binding, member: binder, complete: complete} = Binding(attr, prefix, delim);
                        if (!complete || binding == null) {
                            continue;
                        }
                        var query = attr.value.split("(", 2);
                        var {source: source, member: member, complete: complete} = Object.prototype.memberSelector.select(model, query[0], settings.memberDelim);
                        var value = !complete || source == null ? undefined : source[member];
                        if (typeof value === "function") {
                            value = ((func, context, args, index, config) => function() {
                                return func.apply(context, args.length ? args.map((s => Object.prototype.memberSelector.configure(config, index, s))) : arguments);
                            })(value, source, query.length > 1 ? query[1].split(")")[0].split(",").map((s => s.trim())) : [], node, settings);
                        }
                        binding[binder] = value;
                    }
                }
                if ("childNodes" in node) {
                    for (var child of Array.from(node.childNodes)) {
                        var scope = Settings(child);
                        if (scope && scope !== settings) {
                            continue;
                        }
                        child.bind(model);
                    }
                }
                return node;
            }));
            const Settings = Bind.settings = Object.freeze((function settings(node, overrides = null) {
                if (!(node instanceof Node)) {
                    return;
                }
                if (overrides != null) {
                    return node[BindIndex] = Object.freeze(MVW.Settings.export(overrides));
                }
                if (BindIndex in node) {
                    return node[BindIndex];
                }
                if (node.parentNode && BindIndex in node.parentNode) {
                    return node[BindIndex] = node.parentNode[BindIndex];
                }
            }));
            const Binding = Bind.binding = Object.freeze((function binding(attr, prefix, delim) {
                if (!(attr instanceof Attr) || attr.localName.indexOf(prefix) !== 0) {
                    return {
                        complete: false
                    };
                }
                var binding = attr.ownerElement, members = attr.localName.substr(prefix.length).split(delim);
                for (var i = 0, l = members.length - 1, member = Member(binding, members[0]); i < l && binding != null && binding[member] != null; (binding = binding[member]) && 0 || (member = Member(binding, members[++i]))) {}
                return {
                    binding: binding,
                    member: member,
                    complete: i === l
                };
            }));
            const Member = Bind.member = Object.freeze((function member(source, search) {
                search = `${search}`;
                if (source !== null && typeof source === "object" && search in source) {
                    return search;
                }
                var match, trim = search.trim(), lower = trim.toLowerCase();
                while (source != null) {
                    for (var name of Object.getOwnPropertyNames(source)) {
                        if (name === search || name === trim) {
                            return name;
                        }
                        if ((match = name.trim()) === trim) {
                            return name;
                        }
                        if ((match = match.toLowerCase()) === lower) {
                            return name;
                        }
                    }
                    source = Object.getPrototypeOf(source);
                }
                return search;
            }));
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze(Bind)
            });
        })(Node.prototype, "bind", Symbol("binding"), MVW.Settings.register("bindingDelim", "-"), MVW.Settings.register("bindingPrefix", "bind-"));
    })("src/minimal/Node.prototype.bind.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     Object.prototype.memberSelector
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/Object.prototype.memberSelector
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/Object.prototype.memberSelector.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Element.prototype.querySelector but for members on objects.
*/
        ((ExtensionPoint, ExtensionName, Delim) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            const Query = function memberSelector(selector, assign = null) {
                return Configure(null, this, ...arguments);
            };
            const Configure = Query.configure = Object.freeze((function configure(settings, target, selector, assign) {
                var delim = MVW.Settings.get(Delim, settings);
                var {source: source, member: member, complete: complete} = Select(target, selector, delim);
                if (!complete || source == null) {
                    return;
                }
                return arguments.length < 4 ? source[member] : source[member] = assign;
            }));
            const Select = Query.select = Object.freeze((function select(target, selector, delim) {
                var names = `${selector}`.split(delim);
                for (var i = 0, source = target, l = names.length - 1; i < l && source != null && source[names[i]] != null; source = source[names[i++]]) {}
                return {
                    source: source,
                    member: names[i],
                    complete: i === l
                };
            }));
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze(Query)
            });
        })(Object.prototype, "memberSelector", MVW.Settings.register("memberDelim", "."));
    })("src/minimal/Object.prototype.memberSelector.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     Element.prototype.attribute
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/Element.prototype.attribute
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/Element.prototype.attribute.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         A binding-friendly alternative to Element.prototype.attributes
*/
        ((ExtensionPoint, ExtensionName, Index) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                get: function() {
                    return this[Index] || (this[Index] = (element => new Proxy({}, {
                        has: (_, name) => element.hasAttribute(name),
                        get: (_, name) => element.hasAttribute(name) ? element.getAttribute(name) : false,
                        set: (_, name, value) => value !== false ? element.setAttribute(name, value === true ? name : `${value}`) || true : element.removeAttribute(name) || true,
                        ownKeys: () => Array.from(element.attributes).map((a => a.localName))
                    }))(this));
                }
            });
        })(Element.prototype, "attribute", Symbol("attribute"));
    })("src/standard/Element.prototype.attribute.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     Element.prototype.class
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/Element.prototype.class
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/Element.prototype.class.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         A binding-friendly alternative to Element.prototype.classList
*/
        ((ExtensionPoint, ExtensionName, Index) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                get: function() {
                    return this[Index] || (this[Index] = (element => new Proxy({}, {
                        has: (_, name) => element.classList.contains(name),
                        get: (_, name) => element.classList.contains(name),
                        set: (_, name, value) => element.classList.remove(name) || !!value && element.classList.add(name) || true,
                        ownKeys: () => Array.from(element.classList)
                    }))(this));
                }
            });
        })(Element.prototype, "class", Symbol("class"));
    })("src/standard/Element.prototype.class.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     HTMLElement.prototype.shown
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/HTMLElement.prototype.shown
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/HTMLElement.prototype.shown.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Compliment to the HTMLElement.hidden property
*/
        ((ExtensionPoint, ExtensionName) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                get: function() {
                    return !this.hidden;
                },
                set: function(value) {
                    this.hidden = !value;
                }
            });
        })(HTMLElement.prototype, "shown");
    })("src/standard/HTMLElement.prototype.shown.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     HTMLTemplateElement.prototype.template
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/HTMLTemplateElement.prototype.template
* @source:        
*                 https://github.com/DataDink/mvw/release/v1.3.1/HTMLTemplateElement.prototype.template.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Extends basic binding functionality to have content-generation capabilities
*/
        ((ExtensionPoint, ExtensionName, Content, Data) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            const Template = MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                get: function() {
                    return this[Data];
                },
                set: function(value) {
                    this[Data] = value;
                    var settings = Node.prototype.bind.settings(this);
                    var content = this[Content] || (this[Content] = []);
                    var bindings = value == null ? [] : typeof value === "object" && Symbol.iterator in value ? Array.from(value) : [ value ];
                    for (var i = 0; i < bindings.length && i < content.length; i++) {
                        content[i].forEach((node => Node.prototype.bind.configure(null, node, bindings[i])));
                    }
                    while (content.length > bindings.length) {
                        content.pop().forEach((node => node.parentNode && node.parentNode.removeChild(node)));
                    }
                    for (var i = content.length; i < bindings.length; i++) {
                        var sibling = content[content.length - 1];
                        var insert = (sibling ? sibling[sibling.length - 1] : this).nextSibling;
                        var fragment = this.content.cloneNode(true);
                        Node.prototype.bind.configure(settings, fragment, bindings[i]);
                        var nodes = Array.from(fragment.childNodes);
                        content.push(nodes);
                        nodes.forEach((node => this.parentNode.insertBefore(node, insert)));
                    }
                }
            });
        })(HTMLTemplateElement.prototype, "template", Symbol("template-content"), Symbol("template-data"));
    })("src/standard/HTMLTemplateElement.prototype.template.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     AutoSizeEvent
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/AutoSizeEvent
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/AutoSizeEvent.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Adds js driven content sizing functionality similar to inline-block for Elements 
*                 (e.g. HTMLInputElement)
*/
        ((ExtensionPoint, ExtensionName, AttrName, EvtName, Triggers) => {
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze(class AutoSizeEvent extends Event {
                    constructor() {
                        super(EvtName, {
                            bubbles: true,
                            cancelable: true,
                            composed: false
                        });
                    }
                    static trigger(e) {
                        var target = e && e.target || this;
                        if (!target.hasAttribute(AttrName)) {
                            return;
                        }
                        var restoreWidth = target.style.width;
                        target.style.width = "0px";
                        target.style.width = `${target.scrollWidth}px`;
                        if (target.style.width === "0px") {
                            target.style.width = restoreWidth;
                        }
                        var restoreHeight = target.style.height;
                        target.style.height = "0px";
                        target.style.height = `${target.scrollHeight}px`;
                        if (target.style.height === "0px") {
                            target.style.height = restoreHeight;
                        }
                        target.dispatchEvent(new AutoSizeEvent);
                    }
                    static subscribe(elements) {
                        elements.filter((e => e instanceof Element)).forEach((e => {
                            Triggers.forEach((name => {
                                e.removeEventListener(name, AutoSizeEvent.trigger);
                                e.addEventListener(name, AutoSizeEvent.trigger);
                            }));
                            AutoSizeEvent.trigger.call(e);
                        }));
                    }
                })
            });
            new MutationObserver((records => {
                records.forEach((record => {
                    AutoSizeEvent.subscribe(Array.from(record.addedNodes || []).flatMap((n => [ n, ...n.getElementsByTagName("*") ])));
                }));
            })).observe(document, {
                childList: true,
                subtree: true
            });
            AutoSizeEvent.subscribe(Array.from(document.getElementsByTagName("*")));
        })(Object.getPrototypeOf(function() {
            return this;
        }()), "AutoSizeEvent", "autosize", "autosize", [ "input", "paste" ]);
    })("src/extended/AutoSizeEvent.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     EventSource.prototype.promise
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/EventSource.prototype.promise
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/EventSource.prototype.promise.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  MVW.js
* @notes:         Converts from event-based asynchronous patterns to promises/async/await
*/
        ((ExtensionPoint, ExtensionName, PassEvents, FailEvents) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze((function promise(resolve, reject) {
                    return new Promise(((pass, fail) => {
                        var handlers = [ {
                            key: PassEvents,
                            override: resolve,
                            callback: pass
                        }, {
                            key: FailEvents,
                            override: reject,
                            callback: fail
                        } ].flatMap((setup => (!setup.override ? MVW.Settings.get(setup.key) : typeof setup.override === "string" ? [ setup.override ] : Symbol.iterator in setup.override ? Array.from(setup.override) : [ `${setup.override}` ]).map((name => ({
                            name: name,
                            handler: () => {
                                handlers.forEach((h => this.removeEventListener(h.name, h.handler)));
                                setup.callback(this);
                            }
                        })))));
                        for (var handler of handlers) {
                            this.addEventListener(handler.name, handler.handler);
                        }
                    }));
                }))
            });
        })(EventTarget.prototype, "promise", MVW.Settings.register("successEvents", Object.freeze([ "success", "complete", "done", "load", "ready", "pass" ])), MVW.Settings.register("failureEvents", Object.freeze([ "error", "reject", "fail" ])));
    })("src/extended/EventSource.prototype.promise.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     String.prototype.wrap
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/String.prototype.wrap
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/String.prototype.wrap.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         Utility extension for wrapping text
*/
        ((ExtensionPoint, ExtensionName, Parser, Limit) => {
            if (ExtensionName in ExtensionPoint) {
                return;
            }
            MVWAPPLYEXTENSION(ExtensionPoint, ExtensionName, {
                writable: false,
                value: Object.freeze((function wrap(limiter) {
                    return this.split("\n").map((block => Array.from(block.matchAll(Parser)))).flatMap((block => block.reduce(((lines, next) => {
                        var withWord = lines[lines.length - 1] + next.groups.word;
                        if (Limit(withWord, limiter)) {
                            lines[lines.length - 1] = withWord;
                        } else {
                            lines.push(next.groups.word);
                        }
                        var withSpace = lines[lines.length - 1] + (next.groups.space || "");
                        if (Limit(withSpace, limiter)) {
                            lines[lines.length - 1] = withSpace;
                        }
                        return lines;
                    }), [ "" ]))).join("\n");
                }))
            });
        })(String.prototype, "wrap", /(?<word>\S+)(?<space>\s*)/g, ((test, limiter) => typeof limiter === "number" ? test.length <= limiter : typeof limiter === "function" ? limiter(test) : limiter instanceof RegExp ? limiter.test(test) : false));
    })("src/extended/String.prototype.wrap.js");
    (MVWDEBUGFILEIDENTIFIER => {
        /**
* @product:       mvw v1.3.1 - Minimalistic model-view embracing the DOM
* @component:     console-formatters
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki/console-formatters
* @source:        https://github.com/DataDink/mvw/release/v1.3.1/console-formatters.js
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         Utility extension to simplify color console output
*/
        ((levels, formatter) => (catalog => levels.map((level => console[level])).forEach((root => Object.keys(catalog).filter((m => !(m in root))).forEach((index => MVWAPPLYEXTENSION(root, index, {
            get: () => ((styles, write, log) => (logger => logger[index])(Object.keys(catalog).reduce(((logger, method) => MVWAPPLYEXTENSION(logger, method, {
                get: () => typeof catalog[method] === "function" ? function writer(input) {
                    write(method, styles, input);
                    return logger;
                } : catalog.write(styles, catalog[method]) && logger || logger
            })), (function logger(input) {
                log(styles, input);
            }))))([], ((method, styles, text) => catalog[method](styles, text)), ((styles, text) => root(formatter(catalog, styles, text))))
        }))))))((encode => ({
            debug: function(styles, input) {
                (input.levels = levels) && (input.formatter = formatter) && (input.catalog = this) && (input.styles = styles);
            },
            write: (styles, input) => styles.push(input),
            writeline: (styles, input) => styles.push(input) && styles.push("\n"),
            encode: (styles, input) => styles.push(encode(input)),
            reset: encode(0),
            bold: encode(1),
            light: encode(2),
            italic: encode(3),
            underscore: encode(4),
            blink: encode(5),
            invert: encode(7),
            hidden: encode(8),
            resetWeight: encode(22),
            resetItalic: encode(23),
            resetUnderscore: encode(24),
            resetBlink: encode(25),
            resetHide: encode(28),
            black: encode(30),
            red: encode(31),
            green: encode(32),
            yellow: encode(33),
            blue: encode(34),
            magenta: encode(35),
            cyan: encode(36),
            white: encode(37),
            resetColor: encode(39),
            blackHighlight: encode(40),
            redHighlight: encode(41),
            greenHighlight: encode(42),
            yellowHighlight: encode(43),
            blueHighlight: encode(44),
            magentaHighlight: encode(45),
            cyanHighlight: encode(46),
            whiteHighlight: encode(47),
            noHighlight: encode(47),
            resetHighlight: encode(49)
        }))((id => `[${parseInt(id) || 0}m`))))([ "debug", "info", "log", "warn", "error" ], ((catalog, styles, input) => [ ...styles, input, catalog.reset ].join("")));
    })("src/extended/console-formatters.js");
})("dst/debug/mvw.extended.js");

MVW.Settings.register("version", "mvw.extended.js vundefined");