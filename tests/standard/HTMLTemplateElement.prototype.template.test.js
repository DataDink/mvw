require('../../dst/mvw.standard.js');

test('map a template to a model', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template data-template="item"><span data-textcontent="value"></span></template>';
  var model = {item: {value: 'asdf'}};
  view.map(model);
  var spans = Array.from(view.querySelectorAll('span'));
  expect(spans.length).toBe(1);
  expect(spans[0].textContent).toBe('asdf');
});

test('map a template to an array', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template data-template="items"><span data-textcontent="value"></span></template>';
  var model = {items: [{value: 'a'}, {value: 'b'}, {value: 'c'}]};
  view.map(model);
  var spans = Array.from(view.querySelectorAll('span'));
  expect(spans.length).toBe(3);
  expect(spans[0].textContent).toBe('a');
  expect(spans[1].textContent).toBe('b');
  expect(spans[2].textContent).toBe('c');
});

test('returns data', () => {
  var data = {};
  var template = document.createElement('template');
  template.template = data;
  expect(template.template).toBe(data);
});

test('cleans up on remap', () => {
  var container = document.createElement('div');
  var template = container.appendChild(document.createElement('template'));
  template.innerHTML = '<span></span>';
  template.template = [{}, {}, {}];
  expect(container.childNodes.length).toBe(4);
  template.template = [{}];
  expect(container.childNodes.length).toBe(2);
  template.template = [];
  expect(container.childNodes.length).toBe(1);
});

test('recycles elements', () => {
  var container = document.createElement('div');
  var template = container.appendChild(document.createElement('template'));
  template.innerHTML = '<span></span>';
  template.template = [{}, {}];
  var a = container.childNodes[1];
  var b = container.childNodes[2];
  template.template = [{}, {}];
  expect(a === container.childNodes[1]).toBe(true);
  expect(b === container.childNodes[2]).toBe(true);
  template.template = [];
  template.template = [{}, {}];
  expect(a === container.childNodes[1]).toBe(false);
  expect(b === container.childNodes[2]).toBe(false);
});

test('inserts after template', () => {
  var container = document.createElement('div');
  var template = container.appendChild(document.createElement('template'));
  template.innerHTML = '<span></span>';
  template.template = {};
  expect(container.childNodes.length).toBe(2);
  expect(container.childNodes[0] === template).toBe(true);
});

test('inserts after recycled', () => {
  var container = document.createElement('div');
  var template = container.appendChild(document.createElement('template'));
  template.innerHTML = '<span></span><span></span>';
  template.template = [{}];
  expect(container.childNodes.length).toBe(3);
  var recycledA = container.childNodes[1];
  var recycledB = container.childNodes[2];
  template.template = [{},{}];
  expect(container.childNodes.length).toBe(5);
  var snapshot = Array.from(container.childNodes);
  expect(snapshot.indexOf(recycledA)).toBe(1);
  expect(snapshot.indexOf(recycledB)).toBe(2);
});
