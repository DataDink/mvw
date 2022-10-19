require('../environment.js');

test('select()', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select();
  expect(source).toBe(undefined);
  expect(member).toBe('undefined');
  expect(complete).toBe(true);
});

test('select(undefined, path1-, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(undefined, 'asdf', '.');
  expect(source).toBe(undefined);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('select(null, path1-, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(null, 'asdf', '.');
  expect(source).toBe(null);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('select(number, path1Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(0, 'toString', '.');
  expect(source).toBe(0);
  expect(member).toBe('toString');
  expect(complete).toBe(true);
});

test('select(bool, path1Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(false, 'toString', '.');
  expect(source).toBe(false);
  expect(member).toBe('toString');
  expect(complete).toBe(true);
});

test('select(string, path1Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select('fdsa', 'toString', '.');
  expect(source).toBe('fdsa');
  expect(member).toBe('toString');
  expect(complete).toBe(true);
});

test('select(number, path1Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(0, 'asdf', '.');
  expect(source).toBe(0);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('select(bool, path1Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(false, 'asdf', '.');
  expect(source).toBe(false);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('select(string, path1Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select('fdsa', 'asdf', '.');
  expect(source).toBe('fdsa');
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('select(undefined, path2-, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(undefined, 'a.b', '.');
  expect(source).toBe(undefined);
  expect(member).toBe('a');
  expect(complete).toBe(false);
});

test('select(null, path2-, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(null, 'a.b', '.');
  expect(source).toBe(null);
  expect(member).toBe('a');
  expect(complete).toBe(false);
});

test('select(number, path2Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(0, 'toString.name', '.');
  expect(source).toBe((0).toString);
  expect(member).toBe('name');
  expect(complete).toBe(true);
});

test('select(bool, path2Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(false, 'toString.name', '.');
  expect(source).toBe((false).toString);
  expect(member).toBe('name');
  expect(complete).toBe(true);
});

test('select(string, path2Match, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select('fdsa', 'toString.name', '.');
  expect(source).toBe(('fdsa').toString);
  expect(member).toBe('name');
  expect(complete).toBe(true);
});

test('select(number, path2Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(0, 'a.b', '.');
  expect(source).toBe(0);
  expect(member).toBe('a');
  expect(complete).toBe(false);
});

test('select(bool, path2Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(false, 'a.b', '.');
  expect(source).toBe(false);
  expect(member).toBe('a');
  expect(complete).toBe(false);
});

test('select(string, path2Mismatch, delimMatch)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select('fdsa', 'a.b', '.');
  expect(source).toBe('fdsa');
  expect(member).toBe('a');
  expect(complete).toBe(false);
});

test('select(undefined, path2)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(undefined, 'a.b');
  expect(source).toBeUndefined();
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(null, path2)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(null, 'a.b');
  expect(source).toBe(null);
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(number, path2)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(0, 'a.b');
  expect(source).toBe(0);
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(bool, path2)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select(false, 'a.b');
  expect(source).toBe(false);
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(string, path2)', () => {
  var {source, member, complete} = Object.prototype.memberSelector.select('fdsa', 'a.b');
  expect(source).toBe('fdsa');
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(model, path2Match2, undefined)', () => {
  var model = {a:{b:10}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b', undefined);
  expect(source).toBe(model);
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(model, path1Match1, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a', '.');
  expect(source).toBe(model);
  expect(member).toBe('a');
  expect(complete).toBe(true);
});

test('select(model, path2Match2, delimMatch)', () => {
  var model = {a:{b:10}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b', '.');
  expect(source).toBe(model.a);
  expect(member).toBe('b');
  expect(complete).toBe(true);
});

test('select(model, path3Match3, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b.c', '.');
  expect(source).toBe(model.a.b);
  expect(member).toBe('c');
  expect(complete).toBe(true);
});

test('select(model, path1Match0, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(true);
});

test('select(model, path1Match1, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a', '.');
  expect(source).toBe(model);
  expect(member).toBe('a');
  expect(complete).toBe(true);
});

test('select(model, path1Match1, delimMismatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a', '-');
  expect(source).toBe(model);
  expect(member).toBe('a');
  expect(complete).toBe(true);
});

test('select(model, path2Match2, delimMismatch)', () => {
  var model = {a:{b:10}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b', '-');
  expect(source).toBe(model);
  expect(member).toBe('a.b');
  expect(complete).toBe(true);
});

test('select(model, path3Match3, delimMismatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b.c', '-');
  expect(source).toBe(model);
  expect(member).toBe('a.b.c');
  expect(complete).toBe(true);
});

test('select(model, path-, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(true);
});

test('select(model, path+, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a', '.');
  expect(source).toBe(model);
  expect(member).toBe('a');
  expect(complete).toBe(true);
});

test('select(model, path+-, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.y', '.');
  expect(source).toBe(model.a);
  expect(member).toBe('y');
  expect(complete).toBe(true);
});

test('select(model, path-+, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x.b', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('select(model, path++, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b', '.');
  expect(source).toBe(model.a);
  expect(member).toBe('b');
  expect(complete).toBe(true);
});

test('select(model, path--, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x.y', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('select(model, path+--, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.y.z', '.');
  expect(source).toBe(model.a);
  expect(member).toBe('y');
  expect(complete).toBe(false);
});

test('select(model, path-+-, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x.b.z', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('select(model, path--+, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x.y.c', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('select(model, path-++, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'x.b.c', '.');
  expect(source).toBe(model);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('select(model, path+-+, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.y.c', '.');
  expect(source).toBe(model.a);
  expect(member).toBe('y');
  expect(complete).toBe(false);
});

test('select(model, path++-, delimMatch)', () => {
  var model = {a:{b:{c:10}}};
  var {source, member, complete} = Object.prototype.memberSelector.select(model, 'a.b.z', '.');
  expect(source).toBe(model.a.b);
  expect(member).toBe('z');
  expect(complete).toBe(true);
});

test('call()', () => {
  expect(Object.prototype.memberSelector.call()).toBeUndefined();
});

test('call(undefined, string)', () => {
  expect(Object.prototype.memberSelector.call(undefined, 'asdf')).toBeUndefined();
});

test('call(null, string)', () => {
  expect(Object.prototype.memberSelector.call(null, 'asdf')).toBeUndefined();
});

test('call(number, string)', () => {
  expect(Object.prototype.memberSelector.call(0, 'asdf')).toBeUndefined();
});

test('call(bool, string)', () => {
  expect(Object.prototype.memberSelector.call(true, 'asdf')).toBeUndefined();
});

test('call(string, string)', () => {
  expect(Object.prototype.memberSelector.call('asdf', 'asdf')).toBeUndefined();
});

test('call(object, undefined)', () => {
  expect(Object.prototype.memberSelector.call({'undefined': true}, undefined)).toBe(true);
});

test('call(object, null)', () => {
  expect(Object.prototype.memberSelector.call({'null': true}, null)).toBe(true);
});

test('call(object, number)', () => {
  expect(Object.prototype.memberSelector.call({'1': true}, 1)).toBe(true);
});

test('call(object, bool)', () => {
  expect(Object.prototype.memberSelector.call({'true': false}, true)).toBe(false);
});

test('call(object, string)', () => {
  expect(Object.prototype.memberSelector.call({'asdf': true}, 'asdf')).toBe(true);
});

test('empty unmatched', () => {
  expect(Object.prototype.memberSelector.call({}, '')).toBeUndefined();
});

test('empty matched', () => {
  expect(Object.prototype.memberSelector.call({'': true}, '')).toBe(true);
});

test('member unmatched', () => {
  expect(Object.prototype.memberSelector.call({}, 'a')).toBeUndefined();
});

test('member matched', () => {
  expect(Object.prototype.memberSelector.call({'a': true}, 'a')).toBe(true);
});

test('member-empty unmatched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({}, 'a.')).toBeUndefined();
});

test('member-empty matched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'a': {}}, 'a.')).toBeUndefined();
});

test('member-empty unmatched-matched', () => {
  expect(Object.prototype.memberSelector.call({'': {'': true}}, 'a.')).toBeUndefined();
});

test('member-empty matched-matched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'': true}}, 'a.')).toBe(true);
});

test('empty-member unmatched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'b': true}}, '.a')).toBeUndefined();
});

test('empty-member matched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'': {'b': true}}, '.a')).toBeUndefined();
});

test('empty-member unmatched-matched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'a': true}}, '.a')).toBeUndefined();
});

test('empty-member matched-matched', () => {
  expect(Object.prototype.memberSelector.call({'': {'a': true}}, '.a')).toBe(true);
});

test('member-member unmatched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'': {'': true}}, 'a.b')).toBeUndefined();
});

test('member-member matched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'': true}}, 'a.b')).toBeUndefined();
});

test('member-member unmatched-matched', () => {
  expect(Object.prototype.memberSelector.call({'': {'b': true}}, 'a.b')).toBeUndefined();
});

test('member-member matched-matched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'b': true}}, 'a.b')).toBe(true);
});

test('member-empty-member unmatched-unmatched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-unmatched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-matched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'': {'': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-unmatched-matched', () => {
  expect(Object.prototype.memberSelector.call({'': {'a': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-matched-unmatched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'a': {'': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-unmatched-matched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'a': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member unmatched-matched-matched', () => {
  expect(Object.prototype.memberSelector.call({'': {'': {'b': true}}}, 'a..b')).toBeUndefined();
});

test('member-empty-member matched-matched-matched', () => {
  expect(Object.prototype.memberSelector.call({'a': {'': {'b': true}}}, 'a..b')).toBe(true);
});

test('set undefined', () => {
  expect(Object.prototype.memberSelector.call(undefined, 'a', true)).toBe(true);
  expect(window.a).toBe(true);
});

test('set null', () => {
  expect(Object.prototype.memberSelector.call(null, 'a', false)).toBe(false);
  expect(window.a).toBe(false);
});

test('set number', () => {
  expect(Object.prototype.memberSelector.call(0, 'a', true)).toBe(true);
});

test('set string', () => {
  expect(Object.prototype.memberSelector.call('asdf', 'a', true)).toBe(true);
});

test('set bool', () => {
  expect(Object.prototype.memberSelector.call(false, 'a', true)).toBe(true);
});

test('set member unmatched', () => {
  var target = {};
  expect(Object.prototype.memberSelector.call(target, 'a', true)).toBe(true);
  expect(target.a).toBe(true);
});

test('set member matched', () => {
  var target = {a:false};
  expect(Object.prototype.memberSelector.call(target, 'a', true)).toBe(true);
  expect(target.a).toBe(true);
});

test('set member-member unmatched-unmatched', () => {
  var target = {};
  expect(Object.prototype.memberSelector.call(target, 'a.b', true)).toBeUndefined();
  expect(target.a).toBeUndefined();
});

test('set member-member matched-unmatched', () => {
  var target = {a: {}};
  expect(Object.prototype.memberSelector.call(target, 'a.b', true)).toBe(true);
  expect(target.a.b).toBe(true);
});

test('set member-member unmatched-matched', () => {
  var target = {'': {b: false}};
  expect(Object.prototype.memberSelector.call(target, 'a.b', true)).toBeUndefined();
  expect(target[''].b).toBe(false);
  expect(target.a).toBeUndefined();
});

test('set member-member matched-matched', () => {
  var target = {a: {b: false}};
  expect(Object.prototype.memberSelector.call(target, 'a.b', true)).toBe(true);
  expect(target.a.b).toBe(true);
});

test('read writeonly', () => {
  expect(Object.prototype.memberSelector.call(
    (class { static set a(v) { } }),
    'a'
  )).toBeUndefined();
});

test('write readonly', () => {
  expect(Object.prototype.memberSelector.call(
    (class { static get a() { return true; } }),
    'a',
    true
  )).toBe(true);
});

test('write writeonly', () => {
  expect(Object.prototype.memberSelector.call(
    (class { static set a(v) { } }),
    'a',
    true
  )).toBe(true);
});

test('match configure(memberDelim = ".")', () => {
  expect(Object.prototype.memberSelector.configure({memberDelim: '.'}, {a:{b:{c:10}}}, 'a.b.c'))
    .toBe(10);
});

test('mismatch configure(memberDelim = ".")', () => {
  expect(Object.prototype.memberSelector.configure({memberDelim: '.'}, {a:{b:{c:10}}}, 'a-b-c'))
    .toBeUndefined();
});

test('match configure(memberDelim = "-")', () => {
  expect(Object.prototype.memberSelector.configure({memberDelim: '-'}, {a:{b:{c:10}}}, 'a-b-c'))
    .toBe(10);
});

test('mismatch configure(memberDelim = "-")', () => {
  expect(Object.prototype.memberSelector.configure({memberDelim: '-'}, {a:{b:{c:10}}}, 'a.b.c'))
    .toBeUndefined();
});
