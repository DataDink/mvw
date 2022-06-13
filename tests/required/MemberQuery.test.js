require('../../dst/mvw.js');

test('select a value', () => {
  expect(
    new MemberQuery('member')
      .get({member: 10})
  ).toBe(10);
});

test('select a descendant value', () => {
  expect(
    new MemberQuery('member1.member2')
      .get({member1:{member2: 10}})
  ).toBe(10);
});

test('select a missing value', () => {
  expect(
    new MemberQuery('member')
      .get({})
  ).toBeUndefined();
});

test('select a missing descendant value', () => {
  expect(
    new MemberQuery('member1.member2')
      .get({member1:null})
  ).toBeUndefined();
});

test('selected function is bound', () => {
  var binding = {member() { return this; }};
  expect(
    new MemberQuery('member')
      .get(binding)
      .call({})
  ).toBe(binding);
});

test('param selector queries caller', () => {
  expect(
    new MemberQuery('member(value)')
      .get({member(v) { return v; }})
      .call({value: 10})
  ).toBe(10);
});

test('param selector is bound', () => {
  var binding = {member() { return this; }};
  expect(
    new MemberQuery('member(value)')
      .get(binding)
      .call({value: 10})
  ).toBe(binding);
});

test('param selector missing param', () => {
  expect(
    new MemberQuery('member(value)')
      .get({member(v) { return v; }})
      .call({})
  ).toBeUndefined();
});

test('multiple param selector', () => {
  expect(
    new MemberQuery('member(value1, value2)')
      .get({member(a,b) { return a + b; }})
      .call({value1: 'asdf', value2: 'fdsa'})
  ).toBe('asdffdsa');
});

test('config has defaults', () => {
  var config = new MemberQuery.Config();
  expect(
    Object.keys(config)
          .every(member => config[member] != null)
  ).toBe(true);
});

test("config overrides don't add", () => {
  expect(
    'abcxyz' in (new MemberQuery.Config({abcxyz: 10}))
  ).toBe(false);
});

test("config can override", () => {
  expect(
    (new MemberQuery.Config({memberDelimiter: '/'})).memberDelimiter
  ).toBe('/');
});

test('config pathTerminators is properly formed', () => {
  expect(
    (new MemberQuery.Config({
      selectorDelimiter: '1',
      trimCharacters: '2'
    })).pathTerminators
  ).toBe('12')
});

test('config paramTerminators is properly formed', () => {
  expect(
    (new MemberQuery.Config({
      parameterDelimiter: '1',
      selectorTerminator: '2',
      trimCharacters: '3',
    })).paramTerminators
  ).toBe('123');
});

test('can configure memberDelimiter', () => {
  expect(
    (new MemberQuery('member1-member2', new MemberQuery.Config({
      memberDelimiter: '-'
    })))
    .get({member1:{member2:10}})
  ).toBe(10);
});

test('can configure selectorDelimiter', () => {
  expect(
    (new MemberQuery('binding*member)', new MemberQuery.Config({
      selectorDelimiter: '*'
    })))
    .get({binding(v) { return v; }})
    .call({member: 10})
  ).toBe(10);
});

test('can configure selectorTerminator', () => {
  expect(
    (new MemberQuery('binding(member*', new MemberQuery.Config({
      selectorTerminator: '*'
    })))
    .get({binding(v) { return v; }})
    .call({member: 10})
  ).toBe(10);
});

test('can configure parameterDelimiter', () => {
  expect(
    (new MemberQuery('binding(member1*member2)', new MemberQuery.Config({
      parameterDelimiter: '*'
    })))
    .get({binding(a,b) { return b; }})
    .call({member1:10,member2:20})
  ).toBe(20);
});
