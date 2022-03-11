eval('window.ObjectQuery = ' + require('fs').readFileSync('./src/required/ObjectQuery.js'));

test('select with an empty selector', () => {
  var model = {};
  var query = new ObjectQuery(model, '');
  expect(query.complete).toBe(false);
  expect(query.binding).toBe(undefined);
  expect(query.property).toBe(undefined);
  expect(query.value).toBe(undefined);
});

test('select a missing value', () => {
  var model = {};
  var query = new ObjectQuery(model, 'member1');
  expect(query.complete).toBe(true);
  expect(query.binding).toBe(model);
  expect(query.property).toBe('member1');
  expect(query.value).toBe(undefined);
});

test('select an existing value', () => {
  var model = {member1: 10};
  var query = new ObjectQuery(model, 'member1');
  expect(query.complete).toBe(true);
  expect(query.binding).toBe(model);
  expect(query.property).toBe('member1');
  expect(query.value).toBe(10);
});

test('select a deep value', () => {
  var model = {member1: {member2: {member3: 10}}};
  var query = new ObjectQuery(model, 'member1.member2.member3');
  expect(query.complete).toBe(true);
  expect(query.binding).toBe(model.member1.member2);
  expect(query.property).toBe('member3');
  expect(query.value).toBe(10);
});

test('select a missing path', () => {
  var model = {member1: {}};
  var query = new ObjectQuery(model, 'member1.member2.member3');
  expect(query.complete).toBe(false);
  expect(query.binding).toBe(model.member1);
  expect(query.property).toBe('member2');
  expect(query.value).toBe(undefined);
});

test('select can respect casing', () => {
  var model = {member1: 10, Member1: 20};
  expect(new ObjectQuery(model, 'member1', false).value).toBe(10);
  expect(new ObjectQuery(model, 'member1', false).property).toBe('member1');
  expect(new ObjectQuery(model, 'Member1', false).value).toBe(20);
  expect(new ObjectQuery(model, 'MEMBER1', false).value).toBe(undefined);
  expect(new ObjectQuery(model, 'MEMBER1', false).property).toBe('MEMBER1');
});

test('select can auto-match casing', () => {
  var model = {member1: 10};
  expect(new ObjectQuery(model, 'MEMBER1', true).value).toBe(10);
  expect(new ObjectQuery(model, 'MEMBER1', true).property).toBe('member1');
  expect(new ObjectQuery(model, 'missing', true).value).toBe(undefined);
  expect(new ObjectQuery(model, 'missing', true).property).toBe('missing');
});

test('can match prototype member casing', () => {
  class base { baseMember = 10 }
  class sub extends base {}
  expect(new ObjectQuery(new sub(), 'BaSeMeMbEr', true).property).toBe('baseMember');
});

test('can match non-enumerated members', () => {
  class model { get member() {} };
  expect(new ObjectQuery(new model(), 'MeMbEr', true).property).toBe('member');
});

test('set value with an empty selector', () => {
  var query = new ObjectQuery({}, '');
  query.value = 10;
  expect(query.value).toBe(undefined);
});

test('set a non-existent member', () => {
  var query = new ObjectQuery({}, 'member');
  expect('member' in query.binding).toBe(false);
  expect(query.value).toBe(undefined);
  query.value = 10;
  expect(query.binding.member).toBe(10);
  expect(query.value).toBe(10);
});

test('set an existing member', () => {
  var query = new ObjectQuery({member: 10}, 'member');
  expect('member' in query.binding).toBe(true);
  expect(query.binding.member).toBe(10);
  expect(query.value).toBe(10);
  query.value = 20;
  expect(query.binding.member).toBe(20);
  expect(query.value).toBe(20);
});

test('set a non-existent query', () => {
  var query = new ObjectQuery({}, 'member1.member2');
  query.value = 10;
  expect(query.binding.member1).toBe(undefined);
  expect(query.binding.member2).toBe(undefined);
  expect(query.property).toBe('member1');
  expect(query.value).toBe(undefined);
});

test('set an existing path, non-existent value', () => {
  var query = new ObjectQuery({member1: {}}, 'member1.member2');
  query.value = 10;
  expect(query.property).toBe('member2');
  expect(query.binding.member2).toBe(10);
  expect(query.value).toBe(10);
});
