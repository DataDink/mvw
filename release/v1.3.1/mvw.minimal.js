console.info("https:github.com/DataDink/mvw/release/v1.3.1/mvw.minimal.js");

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
})("dst/debug/mvw.minimal.js");

MVW.Settings.register("version", "mvw.minimal.js vundefined");