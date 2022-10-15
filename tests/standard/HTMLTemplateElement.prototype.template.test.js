require('../environment.js');

test('[bind-template=item]{}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(1);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
});

test('[bind-template=item]{item:undefined}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:undefined};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(1);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
});

test('[bind-template=item]{item:null}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:null};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(1);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
});

test('[bind-template=item]{item:number}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:0};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(2);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBeUndefined();
});

test('[bind-template=item]{item:bool}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:true};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(2);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBeUndefined();
});

test('[bind-template=item]{item:string}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:'asdf'};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(2);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBeUndefined();
});

test('[bind-template=item]{item,value}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:{value:123}};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(2);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBe(model.item.value);
});

test('[bind-template=item]{item,[value]}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:[{value:123}]};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(2);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBe(model.item[0].value);
});

test('[bind-template=item]{item,[value, value, value]}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:[{value:123}, {value:456}, {value:789}]};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(4);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBe(model.item[0].value);
  expect(elements[2].result).toBe(model.item[1].value);
  expect(elements[3].result).toBe(model.item[2].value);
});

test('[bind-template=item]{item,[undefined, null, {}]}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var model = {item:[undefined, null, {}]};
  view.bind(model);
  var elements = view.children;
  expect(elements.length).toBe(4);
  expect(elements[0] instanceof HTMLTemplateElement).toBe(true);
  expect(elements[1] instanceof HTMLSpanElement).toBe(true);
  expect(elements[1].result).toBeUndefined();
  expect(elements[2].result).toBeUndefined();
  expect(elements[3].result).toBeUndefined();
});

test('[bind-template=item]{x3}{x3}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var modelA = {item:[{value:123}, {value:456}, {value:789}]};
  view.bind(modelA);
  var snapshot = Array.from(view.children);
  var modelB = {item:[{value:'abc'}, {value:'def'}, {value:'ghi'}]};
  view.bind(modelB);
  var capture = Array.from(view.children);
  expect(capture.length).toBe(snapshot.length);
  for (var i = 0; i < capture.length; i++) {
    expect(capture[i]).toBe(snapshot[i]);
  }
  for (var i = 0; i < modelB.item.length; i++) {
    expect(capture[i+1].result).toBe(modelB.item[i].value);
  }
});

test('[bind-template=item]{x3}{x2}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var modelA = {item:[{value:123}, {value:456}, {value:789}]};
  view.bind(modelA);
  var snapshot = Array.from(view.children);
  var modelB = {item:[{value:'abc'}, {value:'def'}]};
  view.bind(modelB);
  var capture = Array.from(view.children);
  expect(snapshot.length).toBe(4);
  expect(capture.length).toBe(3);
  for (var i = 0; i < capture.length; i++) {
    expect(capture[i]).toBe(snapshot[i]);
  }
  for (var i = 0; i < modelB.item.length; i++) {
    expect(capture[i+1].result).toBe(modelB.item[i].value);
  }
});

test('[bind-template=item]{x2}{x3}', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"><span bind-result="value"></span></template>';
  var modelA = {item:[{value:123}, {value:456}]};
  view.bind(modelA);
  var snapshot = Array.from(view.children);
  var modelB = {item:[{value:'abc'}, {value:'def'}, {value:'ghi'}]};
  view.bind(modelB);
  var capture = Array.from(view.children);
  expect(snapshot.length).toBe(3);
  expect(capture.length).toBe(4);
  for (var i = 0; i < snapshot.length; i++) {
    expect(capture[i]).toBe(snapshot[i]);
  }
  for (var i = 0; i < modelB.item.length; i++) {
    expect(capture[i+1].result).toBe(modelB.item[i].value);
  }
});

test('.template===.template', () => {
  var view = document.createElement('div');
  view.innerHTML = '<template bind-template="item"></template>';
  var model = {item: {}};
  view.bind(model);
  expect(view.childNodes[0].template).toBe(model.item);
});
