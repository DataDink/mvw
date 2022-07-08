console.log("https://github.com/DataDink/mvw v1.2.0");
(() => {(() => {
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
    static #Index=Symbol(" _mapdata_ ");
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
        window.test = 10;
        return node[Scope.#Index] || (node[Scope.#Index] = node.parentNode && node.parentNode[Scope.#Index]);
    }
};

(() => {
    const QueryCacheIndex = Symbol(" _querycache_ ");
    let Lib = Node.prototype.map = function map(model, config = null) {
        var scope = Node.Scope.continue(this) || Node.Scope.create(this, config);
        return Lib.mapNode(this, model, scope);
    };
    Lib.mapNode = function(node, model, scope) {
        if (scope !== Node.Scope.continue(node)) {
            return node;
        }
        var cache = node[QueryCacheIndex] || (node[QueryCacheIndex] = {});
        Array.from(node.attributes || []).forEach((attribute => {
            if (attribute.name.indexOf(scope.attributePrefix) !== 0) {
                return;
            }
            var viewQuery = cache[attribute.name.toLowerCase()] || (cache[attribute.name.toLowerCase()] = new MemberQuery(Lib.repath(node, attribute.name, scope), scope.queryConfig));
            var modelQuery = cache[attribute.value] || (cache[attribute.value] = new MemberQuery(attribute.value, scope.queryConfig));
            viewQuery.set(node, modelQuery.get(model));
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

Object.defineProperty(Element.prototype, "attribute", {
    configurable: false,
    enumerable: true,
    get: function() {
        var element = this;
        return new Proxy({}, {
            has: (_, name) => element.hasAttribute(name),
            get: (_, name) => element.hasAttribute(name) ? element.getAttribute(name) : false,
            set: (_, name, value) => value != null && value !== false ? element.setAttribute(name, value === true ? name : value) || true : element.removeAttribute(name) || true,
            ownKeys: () => Array.from(element.attributes).map((a => a.name))
        });
    }
});

Object.defineProperty(Element.prototype, "class", {
    configurable: false,
    enumerable: true,
    get: function() {
        var element = this;
        return new Proxy({}, {
            has: (_, name) => element.classList.contains(name),
            get: (_, name) => element.classList.contains(name),
            set: (_, name, value) => element.classList.remove(name) || !!value && element.classList.add(name) || true,
            ownKeys: () => Array.from(element.classList)
        });
    }
});

(() => {
    const Cleanup = Symbol(" _template cleanup_ ");
    const Data = Symbol(" _template model_ ");
    Object.defineProperty(HTMLTemplateElement.prototype, "template", {
        configurable: false,
        enumerable: false,
        get: function() {
            return this[Data];
        },
        set: function(value) {
            this[Data] = value;
            if (Cleanup in this) {
                this[Cleanup]();
            }
            if (!this.parentNode) {
                return;
            }
            var configuration = (Node.Scope.continue(this) || {}).overrides;
            var content = (Array.isArray(value) ? value : [ value ]).filter((v => v != null)).map((model => this.content.cloneNode(true).map(model, configuration))).flatMap((fragment => Array.from(fragment.childNodes)));
            this[Cleanup] = () => {
                content.forEach((e => e.parentNode && e.parentNode.removeChild(e)));
                delete this[Cleanup];
            };
            this.parentNode.insertBefore(content.reduce(((frag, node) => frag.appendChild(node) && frag), document.createDocumentFragment()), this.nextSibling);
        }
    });
})();

(() => {
    let Lib = Object.deserialize = function deserialize(content, config = null) {
        config = new Lib.Config(content, config);
        return Lib.parse(config);
    };
    Lib.parse = function parse(config) {
        config.trim();
        var type = config.source[config.index];
        if (type === "[") {
            return Lib.array(config);
        }
        if (type === "{") {
            return Lib.object(config);
        }
        if (type === '"') {
            return Lib.string(config);
        }
        if (type === "'") {
            return Lib.string(config);
        }
        return Lib.constant(config);
    };
    Lib.array = function array(config) {
        var array = [];
        config.index++;
        config.catalog.push(array);
        config.trim();
        while (config.index < config.source.length && config.source[config.index] !== "]") {
            array.push(Lib.parse(config));
            config.delim();
        }
        config.index++;
        return array;
    };
    Lib.object = function object(config) {
        config.index++;
        config.trim();
        if (config.source[config.index] === "}") {
            return {};
        }
        var instance = Lib.initializer(config);
        while (config.index < config.source.length && config.source[config.index] !== "}") {
            var key = Lib.key(config);
            var value = Lib.parse(config);
            instance[key] = value;
            config.delim();
        }
        config.index++;
        return instance;
    };
    Lib.initializer = function initializer(config) {
        var instance = null;
        var key = Lib.key(config);
        if (key === config.refKey) {
            instance = config.catalog[Lib.parse(config)];
        } else if (key === config.typeKey) {
            config.catalog.push(instance = config.parseType(Lib.parse(config)));
        } else {
            config.catalog.push(instance = {});
            instance[key] = Lib.parse(config);
        }
        config.delim();
        return instance;
    };
    Lib.key = function key(config) {
        var name = Lib.string(config);
        config.delim();
        return name;
    };
    Lib.string = function string(config) {
        var term = config.source[config.index];
        var start = config.index++;
        while (config.index < config.source.length && config.source[config.index] !== term) {
            if (config.source[config.index++] === "\\") {
                config.index++;
            }
        }
        var content = config.source.substring(start, ++config.index);
        return JSON.parse(content);
    };
    Lib.constant = function constant(config) {
        var start = config.index;
        config.index = String.scanUntil(config.source, " \t\r\n,]}", start);
        config.index = config.index === -1 ? config.source.length : config.index;
        return JSON.parse(config.source.substring(start, config.index));
    };
    Lib.Config = class Config {
        refKey="*";
        typeKey=":";
        whitespace=" \t\r\n";
        parseType(value) {
            if (!/^[0-9a-z@$#\.]+$/i.test(value)) {
                return {};
            }
            try {
                return new (eval(value));
            } catch {
                return {};
            }
        }
        constructor(source, overrides = null) {
            Object.override(this, overrides);
            this.source = source;
            this.index = 0;
            this.catalog = [];
            this.delimspace = ",:" + this.whitespace;
            this.trim = () => {
                this.index = String.scanWhile(this.source, this.whitespace, this.index);
                return this.index === -1 ? this.index = this.source.length : this.index;
            };
            this.delim = () => {
                this.index = String.scanWhile(this.source, this.delimspace, this.index);
                return this.index === -1 ? this.index = this.source.length : this.index;
            };
        }
    };
})();

(() => {
    let Lib = Object.serialize = function serialize(object, config = null) {
        config = new Lib.Config(config);
        return Lib.format(object, config);
    };
    Lib.format = function format(value, config) {
        if (typeof value === "function") {
            return JSON.stringify(config.formatFunction(value));
        }
        if (!(value instanceof Object)) {
            return JSON.stringify(value);
        }
        var index = config.catalog.indexOf(value);
        if (index >= 0) {
            return `{${Lib.member(config.refKey, index, config)}}`;
        }
        config.catalog.push(value);
        var isArray = Array.isArray(value);
        var prefix = isArray ? "[" : "{";
        var content = isArray ? value.map((v => Lib.format(v, config))) : [ Lib.member(config.typeKey, config.formatType(value), config) ].concat(Array.from(Lib.fields(value)).map((m => Lib.member(m, value[m], config))));
        var suffix = isArray ? "]" : "}";
        return `${prefix}${content.join(",")}${suffix}`;
    };
    Lib.fields = function* fields(obj) {
        for (var member in obj) {
            if (obj[member] == null || typeof obj[member] === "function") {
                continue;
            }
            yield member;
        }
    };
    Lib.member = function member(name, value, config) {
        return `${JSON.stringify((name || "").toString())}:${Lib.format(value, config)}`;
    };
    Lib.Config = class Config {
        refKey="*";
        typeKey=":";
        formatType(v) {
            return v.constructor.name;
        }
        formatFunction(f) {
            return `function ${f.name}() {}`;
        }
        constructor(overrides) {
            Object.override(this, overrides);
            this.catalog = [];
        }
    };
})();})();