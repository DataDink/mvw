console.log("https://github.com/DataDink/mvw standard v1.2.0");
(() => {
(() => {
    let Lib = (function() {
        return this;
    }()).MemberQuery = class MemberQuery {
        #config;
        #path=[];
        #params=[];
        #property="";
        constructor(selector, config = Lib.Config.Default) {
            this.#config = config;
            var start = String.scanWhile(selector, config.trimCharacters);
            var index = String.scanUntil(selector, config.pathTerms, start);
            this.#path = selector.substring(start, index === -1 ? selector.length : index).split(config.memberDelimiter);
            this.#property = this.#path.pop();
            start = String.scanWhile(selector, config.pathTerms, index);
            if (start !== -1) {
                index = String.scanUntil(selector, config.selectorTerminator, start);
                this.#params = selector.substring(start, index === -1 ? selector.length : index).split(config.parameterDelimiter).map((p => p.trim().split(config.memberDelimiter)));
            }
        }
        get(object) {
            object = Lib.walk(object, this.#path);
            if (object == null) {
                return;
            }
            var value = object[this.#property];
            if (typeof value !== "function") {
                return value;
            }
            if (!this.#params.length) {
                return value.bind(object);
            }
            return (params => function() {
                return value.apply(object, params.map((param => Lib.walk(this, param))));
            })(this.#params);
        }
        set(object, value) {
            object = Lib.walk(object, this.#path);
            if (object == null) {
                return;
            }
            object[this.#property] = value;
        }
        static walk(object, members) {
            for (var i = 0; object != null && i < members.length; i++) {
                object = object[members[i]];
            }
            return object;
        }
        static Config=class Config {
            static #defaultConfig;
            static get Default() {
                return Lib.Config.#defaultConfig || (Lib.Config.#defaultConfig = new MemberQuery.Config);
            }
            memberDelimiter=".";
            selectorDelimiter="(";
            parameterDelimiter=",";
            selectorTerminator=")";
            trimCharacters=" \t";
            constructor(overrides = null) {
                Object.override(this, overrides);
                this.pathTerms = this.selectorDelimiter + this.trimCharacters + this.selectorTerminator;
                Object.freeze(this);
            }
        };
    };
})();

Node.Scope = class Scope {
    static #Index=Symbol("mapping-scope");
    attributePrefix="data-";
    attributeDelimiter="-";
    constructor(overrides = {}) {
        this.overrides = Object.assign({}, overrides || {});
        this.queryConfig = new MemberQuery.Config(this.overrides);
        Object.override(this, this.overrides);
        Object.freeze(this);
        Object.freeze(this.overrides);
    }
    static create(node, overrides = null) {
        return node[Scope.#Index] = new Scope(overrides);
    }
    static continue(node, overrides = null) {
        return node[Scope.#Index] || (node[Scope.#Index] = node.parentNode && node.parentNode[Scope.#Index]);
    }
};

(() => {
    const CacheIndex = Symbol("cached-queries");
    let Lib = Node.prototype.map = function map(model, config = null) {
        var scope = Node.Scope.continue(this) || Node.Scope.create(this, config);
        return Lib.mapNode(this, model, scope);
    };
    Lib.mapNode = function(node, model, scope) {
        if (scope !== Node.Scope.continue(node)) {
            return node;
        }
        var cache = node[CacheIndex] || (node[CacheIndex] = []);
        Array.from(node.attributes || []).forEach((attribute => {
            if (attribute.name.indexOf(scope.attributePrefix) !== 0) {
                return;
            }
            var name = attribute.name.toLowerCase().trim();
            var viewQuery = cache[name] || (cache[name] = new MemberQuery(Lib.repath(node, name, scope), scope.queryConfig));
            var selector = attribute.value.trim();
            var modelQuery = cache[selector] || (cache[selector] = new MemberQuery(selector, scope.queryConfig));
            var oldValue = viewQuery.get(node);
            var newValue = modelQuery.get(model);
            var requiresUpdate = typeof newValue === "object" || oldValue !== newValue;
            if (!requiresUpdate) {
                return;
            }
            viewQuery.set(node, newValue);
        }));
        Array.from(node.childNodes).forEach((child => Lib.mapNode(child, model, scope)));
        return node;
    };
    Lib.repath = function(node, attribute, scope) {
        return attribute.substr(scope.attributePrefix.length).split(scope.attributeDelimiter).map((member => {
            if (node != null && !(member in node)) {
                var normal = member.toLowerCase();
                for (var name in node) {
                    if (normal === name.toLowerCase()) {
                        member = name;
                        break;
                    }
                }
            }
            node = node == null ? null : node[member];
            return member;
        })).join(scope.queryConfig.memberDelimiter);
    };
})();

Object.override = function override(target, source) {
    if (source && target) {
        for (var member in target) {
            if (member in source) {
                target[member] = source[member];
            }
        }
    }
    return target;
};

(() => {
    String.scanUntil = (string, characters, index = 0) => scan(string, characters, index, true);
    String.scanWhile = (string, characters, index = 0) => scan(string, characters, index, false);
    function scan(string, characters, index, method) {
        if (index < 0) {
            return -1;
        }
        if (method) {
            while (index < string.length && characters.indexOf(string[index]) === -1) {
                index++;
            }
        } else {
            while (index < string.length && characters.indexOf(string[index]) !== -1) {
                index++;
            }
        }
        return index >= string.length ? -1 : index;
    }
})();

(() => {
    let Index = Symbol("attribute");
    Object.defineProperty(Element.prototype, "attribute", {
        configurable: false,
        enumerable: true,
        get: function() {
            return this[Index] || (this[Index] = (element => new Proxy({}, {
                has: (_, name) => element.hasAttribute(name),
                get: (_, name) => element.hasAttribute(name) ? element.getAttribute(name) : false,
                set: (_, name, value) => value !== false ? element.setAttribute(name, value === true ? name : value == null ? "" : value) || true : element.removeAttribute(name) || true,
                ownKeys: () => Array.from(element.attributes).map((a => a.name))
            }))(this));
        }
    });
})();

(() => {
    let Index = Symbol("class");
    Object.defineProperty(Element.prototype, "class", {
        configurable: false,
        enumerable: true,
        get: function() {
            return this[Index] || (this[Index] = (element => new Proxy({}, {
                has: (_, name) => element.classList.contains(name),
                get: (_, name) => element.classList.contains(name),
                set: (_, name, value) => element.classList.remove(name) || !!value && element.classList.add(name) || true,
                ownKeys: () => Array.from(element.classList)
            }))(this));
        }
    });
})();

Object.defineProperty(HTMLElement.prototype, "shown", {
    configurable: false,
    enumerable: true,
    get: function() {
        return !this.hidden;
    },
    set: function(value) {
        this.hidden = !value;
    }
});

(() => {
    const Content = Symbol("template-content");
    const Data = Symbol("template-data");
    Object.defineProperty(HTMLTemplateElement.prototype, "template", {
        configurable: false,
        enumerable: false,
        get: function() {
            return this[Data];
        },
        set: function(value) {
            this[Data] = value;
            var content = this[Content] ?? (this[Content] = []);
            var configuration = (Node.Scope.continue(this) || {}).overrides;
            var bindings = value == null ? [] : typeof value === "object" && Symbol.iterator in value ? Array.from(value) : [ value ];
            for (var i = 0; i < bindings.length && i < content.length; i++) {
                content[i].forEach((element => element.map(bindings[i])));
            }
            while (content.length > bindings.length) {
                content.pop().forEach((element => element.parentNode && element.parentNode.removeChild(element)));
            }
            for (var i = content.length; i < bindings.length; i++) {
                var insert = (i > 0 ? content[i - 1][0] ?? this : this).nextSibling;
                var elements = Array.from(this.content.cloneNode(true).map(bindings[i], configuration).childNodes);
                content.push(elements);
                elements.forEach((element => this.parentNode.insertBefore(element, insert)));
            }
        }
    });
})();
})();