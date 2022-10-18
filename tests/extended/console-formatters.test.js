require('../environment.js');

test('can debug', () => {
  expect('debug' in console.log).toBe(true);
  var probe = {};
  console.log.debug(probe);
  expect(Array.isArray(probe.levels)).toBe(true);
  expect(Array.isArray(probe.levels)).toBe(true);
  expect(typeof(probe.formatter)).toBe('function');
  expect(typeof(probe.catalog)).toBe('object');
  expect(Array.isArray(probe.styles)).toBe(true);
  for (var level of probe.levels) {
    var debug = {};
    console[level].debug(debug);
    expect(debug.levels).toBe(probe.levels);
    expect(debug.formatter).toBe(probe.formatter);
    expect(debug.catalog).toBe(probe.catalog);
    expect(debug.styles).not.toBe(probe.styles);
    expect(Array.isArray(debug.styles)).toBe(true);
  }
});

const levels = (debug=>console.log.debug(debug)&&Object.freeze(debug.levels.reduce((o,l)=>(o[l]=console[l])&&o,{forEach:Array.prototype.forEach.bind(debug.levels.map(l=>console[l]))})))({});
const catalog = (debug=>console.log.debug(debug)&&Object.freeze(Object.assign({forEach:Array.prototype.forEach.bind(Object.keys(debug.catalog))}, debug.catalog)))({});
function debug(level) {return(debug=>{return{
  logger: level.debug(debug),
  styles: debug.styles
}})({})}
function formatter() {
    var func = (debug=>console.log.debug(debug)&&debug.formatter)({});
    var empty = func(catalog,[],'');
    var token = 0;
    while (empty.indexOf(`${token}`)>=0) { token++; }
    var marker = `@${token}@`;
    var marked = func(catalog,[],marker);
    var index = marked.indexOf(marker);
    var format = func(...arguments);
    return format.substring(index,format.length-index-marker.length);
}

test('catalog has only strings and funcs', () => {
  catalog.forEach(name => {
    expect(typeof(catalog[name])).toMatch(/^(function|string)$/);
  });
});

test('strings yield loggers, funcs yield writers', () => {
  levels.forEach(level => {
    catalog.forEach(name => {
      expect(level[name].name).toBe(typeof(catalog[name])==='string'?'logger':'writer');
    });
  });
});

test('has at least log', () => {
  expect(typeof(levels.log)).toBe('function');
});

test('has at least write, writeline, encode', () => {
  expect(typeof(catalog.write)).toBe('function');
  expect(typeof(catalog.writeline)).toBe('function');
  expect(typeof(catalog.encode)).toBe('function');
});

test('level has full catalog', () => {
  levels.forEach(level => {
    catalog.forEach(name => {
      var scope = level[name];
      expect(typeof(scope)).toBe('function');
      expect(scope.name).toMatch(/^(logger|writer)$/);
    });
  });
});

test('scope has full catalog', () => {
  levels.forEach(level => {
    catalog.forEach(levelName => {
      var scope = level[levelName];
      scope=scope.name==='writer'?scope(''):scope;
      catalog.forEach(scopeName => {
        var value = scope[scopeName];
        expect(typeof(value)).toBe('function');
        expect(value.name).toMatch(/^(logger|writer)$/);
      });
    });
  });
});

test('level yields unique scopes', () => {
  levels.forEach(level => {
    catalog.forEach(name => {
      var compare = [level[name],level[name]]
                    .map(v => v.name==='writer'?v(''):v);
      expect(compare[0]).not.toBe(compare[1]);
    });
  });
});

test('scope yields same scope', () => {
  levels.forEach(level => {
    catalog.forEach(levelName => {
      var scope = level[levelName];
      scope=scope.name==='writer'?scope(''):scope;
      catalog.forEach(scopeName => {
        var compare = [scope[scopeName], scope[scopeName]]
                      .map(v => v.name==='writer'?v(''):v);
        expect(compare[0]).toBe(compare[1]);
      });
    });
  });
});

test('level yields unique build', () => {
  levels.forEach(level => {
    var {styles:a} = debug(level);
    var {styles:b} = debug(level);
    expect(a).not.toBe(b);
  });
});

test('index strings -> same node', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    var count = 0;
    catalog.forEach(name => {
      if (typeof(catalog[name])==='string') {
        logger[name];
        expect(styles[count]).toBe(catalog[name]);
        expect(styles.length).toBe(++count);
      }
    });
  });
});

test('index strings -> descending nodes', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    var count = 0;
    catalog.forEach(name => {
      if (typeof(catalog[name])==='string') {
        logger = logger[name];
        expect(styles[count]).toBe(catalog[name]);
        expect(styles.length).toBe(++count);
      }
    });
  });
});

test('write -> same node', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    for (var i = 0; i < 3; i++) {
      var note = `write${i}`;
      logger.write(note);
      expect(styles.length).toBe(i+1);
      expect(styles[i]).toBe(note);
    }
  });
});

test('write -> descending nodes', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    for (var i = 0; i < 3; i++) {
      var note = `write${i}`;
      logger = logger.write(note);
      expect(styles.length).toBe(i+1);
      expect(styles[i]).toBe(note);
    }
  });
});

test('write -> nothing', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write();
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(undefined);
  });
});

test('write -> undefined', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write(undefined);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(undefined);
  });
});

test('write -> null', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write(null);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(null);
  });
});

test('write -> number', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write(0);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(0);
  });
});

test('write -> bool', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write(true);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(true);
  });
});

test('write -> string', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    logger.write('asdf');
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe('asdf');
  });
});

test('write -> object', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    var instance = {};
    logger.write(instance);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(instance);
  });
});

test('write -> function', () => {
  levels.forEach(level => {
    var {logger,styles} = debug(level);
    var instance = ()=>{};
    logger.write(instance);
    expect(styles.length).toBe(1);
    expect(styles[0]).toBe(instance);
  });
});

test('formatter -> (cat,[],)', () => {
  expect(formatter(catalog, [])).toMatch('');
});

test('formatter -> (cat,[],undefined)', () => {
  expect(formatter(catalog, [], undefined)).toMatch('');
});

test('formatter -> (cat,[],null)', () => {
  expect(formatter(catalog, [], null)).toMatch('');
});

test('formatter -> (cat,[],number)', () => {
  expect(formatter(catalog, [], 0)).toMatch('0');
});

test('formatter -> (cat,[],bool)', () => {
  expect(formatter(catalog, [], false)).toMatch('false');
});

test('formatter -> (cat,[],string)', () => {
  expect(formatter(catalog, [], 'asdf')).toMatch('asdf');
});

test('formatter -> (cat,[undefined],undefined)', () => {
  expect(formatter(catalog, [undefined], undefined)).toMatch('');
});

test('formatter -> (cat,[null],null)', () => {
  expect(formatter(catalog, [undefined], undefined)).toMatch('');
});

test('formatter -> (cat,[number],number)', () => {
  expect(formatter(catalog, [0], 0)).toMatch('00');
});

test('formatter -> (cat,[bool],bool)', () => {
  expect(formatter(catalog, [false], true)).toMatch('falsetrue');
});

test('formatter -> (cat,[string],string)', () => {
  expect(formatter(catalog, ['asdf'], 'fdsa')).toMatch('asdffdsa');
});

test('formatter -> (cat,[string,string],string)', () => {
  expect(formatter(catalog, ['asdf'], 'fdsa')).toMatch('asdffdsa');
});

test('formatter -> (cat,[string,string],string)', () => {
  expect(formatter(catalog, ['a','b'], 'c')).toMatch('abc');
});
