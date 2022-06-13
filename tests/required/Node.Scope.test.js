require('../../dst/mvw.js');

test('can create instance', () => {
  expect(new Node.Scope())
  .not.toBeUndefined();
});

test('can create node instance', () => {
  expect(
    Node.Scope.create(document.createElement('div'))
  ).not.toBeUndefined();
});

test('has defaults', () => {
  var config = new Node.Scope();
  expect(
    Object.keys(config)
          .every(member => config[member] != null)
  ).toBe(true);
});

test("overrides don't add", () => {
  expect(
    'abcxyz' in (new Node.Scope({abcxyz: 10}))
  ).toBe(false);
});

test("can override", () => {
  expect(
    (new Node.Scope({attributePrefix: '/'})).attributePrefix
  ).toBe('/');
  expect(
    Node.Scope.create(document, {attributePrefix: '*'}).attributePrefix
  ).toBe('*');
});

test('create does not inherit', () => {
  var parent = document.createElement('div');
  var scope = Node.Scope.create(parent);
  expect(
    scope === Node.Scope.create(parent.appendChild(document.createElement('div')))
  ).toBe(false);
});

test('continue inherits', () => {
  var parent = document.createElement('div');
  var scope = Node.Scope.create(parent);
  expect(
    scope === Node.Scope.continue(parent.appendChild(document.createElement('div')))
  ).toBe(true);
});

test('create replaces existing', () => {
  var node = document.createElement('div');
  expect(
    Node.Scope.create(node) === Node.Scope.create(node)
  ).toBe(false);
});

test('continue reuses existing', () => {
  var node = document.createElement('div');
  expect(
    Node.Scope.create(node) === Node.Scope.continue(node)
  ).toBe(true);
});

test('continue does not create', () => {
  expect(
    null == Node.Scope.continue(document.createElement('div'))
  ).toBe(true);
});

test('queryConfig is created', () => {
  var scope = new Node.Scope();
  expect(
    'queryConfig' in scope
  ).toBe(true);
});
