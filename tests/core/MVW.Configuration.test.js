require('../environment.js');

// NOTE: Do not re-use registers across tests

test('no value', () => {
  expect(MVW.Settings.get('novalue')).toBeUndefined();
});

test('double register', () => {
  MVW.Settings.register('doubleregister', null);
  expect(() => MVW.Settings.register('doubleregister', null)).toThrow('doubleregister');
});

test('no default', () => {
  MVW.Settings.register('nodefault');
  expect(MVW.Settings.get('nodefault')).toBeUndefined();
});

test('null default', () => {
  MVW.Settings.register('nulldefault', null);
  expect(MVW.Settings.get('nulldefault')).toBeNull();
});

test('string default', () => {
  MVW.Settings.register('stringdefault', "asdf");
  expect(MVW.Settings.get('stringdefault')).toBe("asdf");
});

test('number default', () => {
  MVW.Settings.register('numberdefault', 10);
  expect(MVW.Settings.get('numberdefault')).toBe(10);
});

test('bool default', () => {
  MVW.Settings.register('booldefault', true);
  expect(MVW.Settings.get('booldefault')).toBe(true);
});

test('no name', () => {
  expect(MVW.Settings.register()).toBe('undefined');
});

test('null name', () => {
  expect(MVW.Settings.register(null, 'nullname')).toBe('null');
  expect(MVW.Settings.get(null)).toBe('nullname');
});

test('string name', () => {
  expect(MVW.Settings.register('stringname', 'stringname')).toBe('stringname');
  expect(MVW.Settings.get('stringname')).toBe('stringname');
});

test('number name', () => {
  expect(MVW.Settings.register(1, 'numbername')).toBe('1');
  expect(MVW.Settings.get(1)).toBe('numbername');
});

test('bool name', () => {
  expect(MVW.Settings.register(true, 'boolname')).toBe('true');
  expect(MVW.Settings.get(true)).toBe('boolname');
});

test('object name', () => {
  expect(MVW.Settings.register({}, 'objectname')).toBe(`${{}}`);
  expect(MVW.Settings.get({})).toBe('objectname');
});

test('override with null', () => {
  MVW.Settings.register('overridewithnull', true);
  expect(MVW.Settings.get('overridewithnull', null)).toBe(true);
});

test('override with undefined', () => {
  MVW.Settings.register('overridewithundefined', true);
  expect(MVW.Settings.get('overridewithundefined', (() =>{})())).toBe(true);
});

test('override with string', () => {
  MVW.Settings.register('overridewithstring', true);
  expect(MVW.Settings.get('overridewithstring', 'asdf')).toBe(true);
});

test('override with number', () => {
  MVW.Settings.register('overridewithnumber', true);
  expect(MVW.Settings.get('overridewithnumber', 1)).toBe(true);
});

test('override with object no value', () => {
  MVW.Settings.register('overridewithobjectnovalue', true);
  expect(MVW.Settings.get('overridewithobjectnovalue', {})).toBe(true);
});

test('override with object with value', () => {
  MVW.Settings.register('overridewithobjectwithvalue', true);
  expect(MVW.Settings.get('overridewithobjectwithvalue', {overridewithobjectwithvalue: false})).toBe(false);
});

test('export no overrides', () => {
  var basename = 'exportnooverrides';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var ex = MVW.Settings.export();
  names.forEach(name => expect(name in ex).toBe(true));
  names.forEach(name => expect(ex[name]).toBe(true));
});

test('export zero override', () => {
  var basename = 'exportzerooverride';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var ex = MVW.Settings.export({});
  names.forEach(name => expect(name in ex).toBe(true));
  names.forEach(name => expect(ex[name]).toBe(true));
});

test('export one override', () => {
  var basename = 'exportoneoverride';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var ex = MVW.Settings.export({[names[0]]: false});
  names.forEach(name => expect(name in ex).toBe(true));
  expect(ex[names.shift()]).toBe(false);
  names.forEach(name => expect(ex[name]).toBe(true));
});

test('export three override', () => {
  var basename = 'exportthreeoverride';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var override = names.reduce((o,n) => (o[n]=false)||o,{});
  var ex = MVW.Settings.export(override);
  names.forEach(name => expect(name in ex).toBe(true));
  names.forEach(name => expect(ex[name]).toBe(false));
});

test('export extra override', () => {
  var basename = 'exportextraoverride';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var override = names.reduce((o,n) => (o[n]=false)||o,{});
  override[basename] = true;
  var ex = MVW.Settings.export(override);
  expect(basename in ex).toBe(false);
  names.forEach(name => expect(name in ex).toBe(true));
  names.forEach(name => expect(ex[name]).toBe(false));
});

test('export double override', () => {
  var basename = 'exportdoubleoverride';
  var names = [...new Array(3)].map((_,i) => `${basename}${i}`);
  names.forEach(name => MVW.Settings.register(name, true));
  var override1 = names.reduce((o,n) => (o[n]=false)||o,{});
  var member = names.shift();
  var override2 = {[member]: 10};
  var ex = MVW.Settings.export(override1, override2);
  names.forEach(name => expect(name in ex).toBe(true));
  names.forEach(name => expect(ex[name]).toBe(false));
  expect(member in ex).toBe(true);
  expect(ex[member]).toBe(10);
});
