require('../environment.js');
require('../../dst/debug/mvw.minimal.js');

test('call()', () => {
  expect(Object.prototype.queryMember.call()).toBeUndefined();
});

test('call(undefined, string)', () => {
  expect(Object.prototype.queryMember.call((() => {})(), 'asdf')).toBeUndefined();
});

test('call(null, string)', () => {
  expect(Object.prototype.queryMember.call(null, 'asdf')).toBeUndefined();
});

test('call(number, string)', () => {
  expect(Object.prototype.queryMember.call(0, 'asdf')).toBeUndefined();
});

test('call(bool, string)', () => {
  expect(Object.prototype.queryMember.call(true, 'asdf')).toBeUndefined();
});

test('call(string, string)', () => {
  expect(Object.prototype.queryMember.call('asdf', 'asdf')).toBeUndefined();
});

test('call(object, undefined)', () => {
  expect(Object.prototype.queryMember.call({'undefined': true}, (() => {})())).toBe(true);
});

test('call(object, null)', () => {
  expect(Object.prototype.queryMember.call({'null': true}, null)).toBe(true);
});

test('call(object, number)', () => {
  expect(Object.prototype.queryMember.call({'1': true}, 1)).toBe(true);
});

test('call(object, bool)', () => {
  expect(Object.prototype.queryMember.call({'true': false}, true)).toBe(false);
});

test('call(object, string)', () => {
  expect(Object.prototype.queryMember.call({'asdf': true}, 'asdf')).toBe(true);
});

test('empty unmatched', () => {
  expect(Object.prototype.queryMember.call({}, '')).toBeUndefined();
});

test('empty matched', () => {
  expect(Object.prototype.queryMember.call({'': true}, '')).toBe(true);
});

test('member unmatched', () => {
  expect(Object.prototype.queryMember.call({}, 'a')).toBeUndefined();
});

test('member matched', () => {
  expect(Object.prototype.queryMember.call({'a': true}, 'a')).toBe(true);
});

test('member-empty unmatched-unmatched', () => {
  expect(Object.prototype.queryMember.call({}, 'a.')).toBeUndefined();
});

test('member-empty matched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'a': {}}, 'a.')).toBeUndefined();
});

test('member-empty unmatched-matched', () => {
  expect(Object.prototype.queryMember.call({'': {'': true}}, 'a.')).toBeUndefined();
});

test('member-empty matched-matched', () => {
  expect(Object.prototype.queryMember.call({'a': {'': true}}, 'a.')).toBe(true);
});

test('empty-member unmatched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'a': {'b': true}}, '.a')).toBeUndefined();
});

test('empty-member matched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'': {'b': true}}, '.a')).toBeUndefined();
});

test('empty-member unmatched-matched', () => {
  expect(Object.prototype.queryMember.call({'a': {'a': true}}, '.a')).toBeUndefined();
});

test('empty-member matched-matched', () => {
  expect(Object.prototype.queryMember.call({'': {'a': true}}, '.a')).toBe(true);
});

test('member-member unmatched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'': {'': true}}, 'a.b')).toBeUndefined();
});

test('member-member matched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'a': {'': true}}, 'a.b')).toBeUndefined();
});

test('member-member unmatched-matched', () => {
  expect(Object.prototype.queryMember.call({'': {'b': true}}, 'a.b')).toBeUndefined();
});

test('member-member matched-matched', () => {
  expect(Object.prototype.queryMember.call({'a': {'b': true}}, 'a.b')).toBe(true);
});

test('member-empty-member unmatched-unmatched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-unmatched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'a': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-matched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'': {'': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-unmatched-matched', () => {
  expect(Object.prototype.queryMember.call({'': {'a': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-matched-unmatched', () => {
  expect(Object.prototype.queryMember.call({'a': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-unmatched-matched', () => {
  expect(Object.prototype.queryMember.call({'a': {'a': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-matched-matched', () => {
  expect(Object.prototype.queryMember.call({'': {'': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-matched-matched', () => {
  expect(Object.prototype.queryMember.call({'a': {'': {'b': true}}}, 'a..b')).toBe(true);
});

test('set undefined', () => {
  expect(Object.prototype.queryMember.call((() => {})(), 'a', true)).toBe(true);
  expect(window.a).toBe(true);
});

test('set null', () => {
  expect(Object.prototype.queryMember.call(null, 'a', false)).toBe(false);
  expect(window.a).toBe(false);
});

test('set number', () => {
  expect(Object.prototype.queryMember.call(0, 'a', true)).toBe(true);
});

test('set string', () => {
  expect(Object.prototype.queryMember.call('asdf', 'a', true)).toBe(true);
});

test('set bool', () => {
  expect(Object.prototype.queryMember.call(false, 'a', true)).toBe(true);
});

test('set member unmatched', () => {
  var target = {};
  expect(Object.prototype.queryMember.call(target, 'a', true)).toBe(true);
  expect(target.a).toBe(true);
});

test('set member matched', () => {
  var target = {a:false};
  expect(Object.prototype.queryMember.call(target, 'a', true)).toBe(true);
  expect(target.a).toBe(true);
});

test('set member-member unmatched-unmatched', () => {
  var target = {};
  expect(Object.prototype.queryMember.call(target, 'a.b', true)).toBeUndefined();
  expect(target.a).toBeUndefined();
});

test('set member-member matched-unmatched', () => {
  var target = {a: {}};
  expect(Object.prototype.queryMember.call(target, 'a.b', true)).toBe(true);
  expect(target.a.b).toBe(true);
});

test('set member-member unmatched-matched', () => {
  var target = {'': {b: false}};
  expect(Object.prototype.queryMember.call(target, 'a.b', true)).toBeUndefined();
  expect(target[''].b).toBe(false);
  expect(target.a).toBeUndefined();
});

test('set member-member matched-matched', () => {
  var target = {a: {b: false}};
  expect(Object.prototype.queryMember.call(target, 'a.b', true)).toBe(true);
  expect(target.a.b).toBe(true);
});

test('read writeonly', () => {
  expect(Object.prototype.queryMember.call(
    (class { static set a(v) { } }),
    'a'
  )).toBeUndefined();
});

test('write readonly', () => {
  expect(Object.prototype.queryMember.call(
    (class { static get a() { return true; } }),
    'a',
    true
  )).toBe(true);
});

test('write writeonly', () => {
  expect(Object.prototype.queryMember.call(
    (class { static set a(v) { } }),
    'a',
    true
  )).toBe(true);
});

test('default nonAssignment', () => {
  var def = MVW.Settings.get('nonAssignment');
  var target = {a: {b: true}};
  expect(Object.prototype.queryMember.call(target, 'a.b', def, {})).toBe(true);
  expect(target.a.b).toBe(true);
});

test('override nonAssignment', () => {
  var def = 'asdf';
  var target = {a: {b: true}};
  expect(Object.prototype.queryMember.call(target, 'a.b', def, {nonAssignment: def})).toBe(true);
  expect(target.a.b).toBe(true);
});

test('casing sensitive mismatch', () => {
  var model = {a: {b: true}};
  expect(Object.prototype.queryMember.call(model, 'A.b', null, {memberCasing: true})).toBeUndefined();
});

test('casing sensitive match', () => {
  var model = {A: {b: true}};
  expect(Object.prototype.queryMember.call(model, 'A.b', null, {memberCasing: true})).toBe(true);
});

test('casing insensitive mismatch', () => {
  var model = {a: {b: true}};
  expect(Object.prototype.queryMember.call(model, 'A.b', null, {memberCasing: false})).toBe(true);
});

test('casing insensitive match', () => {
  var model = {A: {b: true}};
  expect(Object.prototype.queryMember.call(model, 'A.b', null, {memberCasing: false})).toBe(true);
});
