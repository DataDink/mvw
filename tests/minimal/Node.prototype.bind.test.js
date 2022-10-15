require('../environment.js');

test('member()', () => {
  expect(Node.prototype.bind.member()).toBe('undefined');
});

test('member(undefined)', () => {
  expect(Node.prototype.bind.member(undefined)).toBe('undefined');
});

test('member(null)', () => {
  expect(Node.prototype.bind.member(null)).toBe('undefined');
});

test('member(number)', () => {
  expect(Node.prototype.bind.member(0)).toBe('undefined');
});

test('member(bool)', () => {
  expect(Node.prototype.bind.member(false)).toBe('undefined');
});

test('member(string)', () => {
  expect(Node.prototype.bind.member('fdsa')).toBe('undefined');
});

test('member(undefined, "tostring")', () => {
  expect(Node.prototype.bind.member(undefined, 'tostring')).toBe('tostring');
});

test('member(null, "tostring")', () => {
  expect(Node.prototype.bind.member(null, 'tostring')).toBe('tostring');
});

test('member(number, "tostring")', () => {
  expect(Node.prototype.bind.member(0, 'tostring')).toBe('toString');
});

test('member(bool, "tostring")', () => {
  expect(Node.prototype.bind.member(false, 'tostring')).toBe('toString');
});

test('member(string, "tostring")', () => {
  expect(Node.prototype.bind.member('fdsa', 'tostring')).toBe('toString');
});

test('member(model, match)', () => {
  expect(Node.prototype.bind.member({'ASdf': 10}, 'ASdf')).toBe('ASdf');
});

test('member(model, casing)', () => {
  expect(Node.prototype.bind.member({'ASdf': 10}, 'asDF')).toBe('ASdf');
});

test('member(model, trimming)', () => {
  expect(Node.prototype.bind.member({'ASdf': 10}, ' ASdf ')).toBe('ASdf');
});

test('member(model, casing/trimming)', () => {
  expect(Node.prototype.bind.member({'ASdf': 10}, ' asDF ')).toBe('ASdf');
});

test('member(model, casing/trimming/whitespace)', () => {
  expect(Node.prototype.bind.member({'ASdf': 10}, ' as DF ')).toBe(' as DF ');
  expect(Node.prototype.bind.member({'AS df': 10}, ' as DF ')).toBe('AS df');
});

test('binding()', () => {
  var {binding, member, complete} = Node.prototype.bind.binding();
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(undefined, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding(undefined, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(null, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding(null, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(number, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding(0, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(bool, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding(false, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(string, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding('asdf', 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(object, "pre-", "-")', () => {
  var {binding, member, complete} = Node.prototype.bind.binding({
    name: "pre-thing",
    localName: "pre-thing",
    ownerElement: document.body,
    value: 'asdf'
  }, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(prefixMatch, "pre-", "-")', () => {
  var node = document.createElement('div');
  var name = 'pre-asdf';
  node.setAttribute(name, 'asdf');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('binding(prefixMismatch, "pre-", "-")', () => {
  var node = document.createElement('div');
  var name = 'ex-asdf';
  node.setAttribute(name, 'asdf');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBeUndefined();
  expect(member).toBeUndefined();
  expect(complete).toBe(false);
});

test('binding(path+, "pre-", "-")', () => {
  var node = document.createElement('div');
  var name = 'pre-asdf';
  node.ASdf = 10
  node.setAttribute(name, 'asdf');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('ASdf');
  expect(complete).toBe(true);
});

test('binding(path-, "pre-", "-")', () => {
  var node = document.createElement('div');
  var name = 'pre-asdf';
  node.fdsa = 10
  node.setAttribute(name, 'asdf');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('asdf');
  expect(complete).toBe(true);
});

test('binding(path+--, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a-y-z';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node.A);
  expect(member).toBe('y');
  expect(complete).toBe(false);
});

test('binding(path-+-, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-x-b-z';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('binding(path--+, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-x-y-c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('binding(path++-, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a-b-z';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node.A.B);
  expect(member).toBe('z');
  expect(complete).toBe(true);
});

test('binding(path+-+, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a-y-c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node.A);
  expect(member).toBe('y');
  expect(complete).toBe(false);
});

test('binding(path-++, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-x-b-c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node);
  expect(member).toBe('x');
  expect(complete).toBe(false);
});

test('binding(path+++, "pre-", "-")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a-b-c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '-');
  expect(binding).toBe(node.A.B);
  expect(member).toBe('C');
  expect(complete).toBe(true);
});

test('binding(path+++, "pre-", mismatch)', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a-b-c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '_');
  expect(binding).toBe(node);
  expect(member).toBe('a-b-c');
  expect(complete).toBe(true);
});

test('binding(path+++, "pre-", "_")', () => {
  var node = document.createElement('div');
  node.A = {B:{C:10}}
  var name = 'pre-a_b_c';
  node.setAttribute(name, '');
  var attr = node.attributes[name];
  var {binding, member, complete} = Node.prototype.bind.binding(attr, 'pre-', '_');
  expect(binding).toBe(node.A.B);
  expect(member).toBe('C');
  expect(complete).toBe(true);
});

test('settings()', () => {
  expect(Node.prototype.bind.settings())
    .toBeUndefined();
});

test('settings(undefined)', () => {
  expect(Node.prototype.bind.settings(undefined))
    .toBeUndefined();
});

test('settings(null)', () => {
  expect(Node.prototype.bind.settings(null))
    .toBeUndefined();
});

test('settings(number)', () => {
  expect(Node.prototype.bind.settings(0))
    .toBeUndefined();
});

test('settings(bool)', () => {
  expect(Node.prototype.bind.settings(false))
    .toBeUndefined();
});

test('settings(string)', () => {
  expect(Node.prototype.bind.settings('fdsa'))
    .toBeUndefined();
});

test('settings(object)', () => {
  expect(Node.prototype.bind.settings({}))
    .toBeUndefined();
});

test('settings(div)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node))
    .toBeUndefined();
});

test('settings(div, undefined)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node, undefined))
    .toBeUndefined();
});

test('settings(div, null)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node, null))
    .toBeUndefined();
});

test('settings(div, bool)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node, false)).toEqual(MVW.Settings.export());
});

test('settings(div, number)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node, 0)).toEqual(MVW.Settings.export());
});

test('settings(div, string)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.settings(node, 'asdf')).toEqual(MVW.Settings.export());
});

test('settings(div, object)', () => {
  var node = document.createElement('div');
  var exported = MVW.Settings.export();
  var override = {};
  var setting = Node.prototype.bind.settings(node, override);
  expect(setting).not.toBe(override);
  expect(setting).not.toBe(exported);
  expect(setting).toEqual(exported);
});

test('settings(div, overrides2)', () => {
  var node = document.createElement('div');
  var names = [...new Array(2)].map((_,i) => `settings_overrides2_${i}`);
  names.forEach(name => MVW.Settings.register(name, false));
  var exported = MVW.Settings.export();
  var override = names.reduce((o,n) => (o[n]=true)&&o, {});
  var setting = Node.prototype.bind.settings(node, override);
  expect(setting).not.toBe(override);
  expect(setting).not.toBe(exported);
  expect(Object.keys(setting)).toEqual(Object.keys(exported));
  for (name of names) {
    expect(exported[name]).toBe(false);
    expect(setting[name]).toBe(true);
  }
});

test('settings(inherit)', () => {
  var parent = document.createElement('div');
  var parentSetting = Node.prototype.bind.settings(parent, {});
  var child = parent.appendChild(document.createElement('div'));
  var childSetting = Node.prototype.bind.settings(child);
  expect(childSetting).toBe(parentSetting);
});

test('settings(retrieval)', () => {
  var node = document.createElement('div');
  var setting = Node.prototype.bind.settings(node, {});
  expect(Node.prototype.bind.settings(node)).toBe(setting);
});

test('settings(replacement)', () => {
  var node = document.createElement('div');
  var original = Node.prototype.bind.settings(node, {});
  var replacement = Node.prototype.bind.settings(node, {});
  expect(replacement).not.toBe(original);
  expect(Node.prototype.bind.settings(node)).toBe(replacement);
});

test('configure()', () => {
  expect(Node.prototype.bind.configure()).toBeUndefined();
});

test('configure(undefined)', () => {
  expect(Node.prototype.bind.configure(undefined)).toBeUndefined();
});

test('configure(null)', () => {
  expect(Node.prototype.bind.configure(null)).toBeUndefined();
});

test('configure(number)', () => {
  expect(Node.prototype.bind.configure(0)).toBeUndefined();
});

test('configure(bool)', () => {
  expect(Node.prototype.bind.configure(false)).toBeUndefined();
});

test('configure(string)', () => {
  expect(Node.prototype.bind.configure('asdf')).toBeUndefined();
});

test('configure(null, undefined)', () => {
  expect(Node.prototype.bind.configure(null, undefined)).toBeUndefined();
});

test('configure(null, null)', () => {
  expect(Node.prototype.bind.configure(null, null)).toBe(null);
});

test('configure(null, number)', () => {
  expect(Node.prototype.bind.configure(null, 0)).toBe(0);
});

test('configure(null, bool)', () => {
  expect(Node.prototype.bind.configure(null, false)).toBe(false);
});

test('configure(null, string)', () => {
  expect(Node.prototype.bind.configure(null, 'asdf')).toBe('asdf');
});

test('configure(null, object)', () => {
  var ref = {};
  expect(Node.prototype.bind.configure(null, ref)).toBe(ref);
});

test('configure(null, node)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node)).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure(null, node, undefined)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node, undefined)).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure(null, node, null)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node, null)).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure(null, node, number)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node, 0)).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure(null, node, bool)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node, true)).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure(null, node, string)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure(null, node, 'asdf')).toBe(node);
  expect(Node.prototype.bind.settings(node)).not.toBeUndefined();
});

test('configure({bindingDelim}, node)', () => {
  var node = document.createElement('div');
  expect(Node.prototype.bind.configure({bindingDelim: '+'}, node)).toBe(node);
  expect(Node.prototype.bind.settings(node).bindingDelim).toBe('+');
});

test('configure({bindingPrefix: match}, node[bind_test=value], {value})', () => {
  var node = document.createElement('div');
  node.setAttribute('bind_test', 'value');
  expect(Node.prototype.bind.configure({bindingPrefix: 'bind_'}, node, {value:true})).toBe(node);
  expect(node.test).toBe(true);
});

test('configure({bindingPrefix: mismatch}, node[bind_test=value], {value})', () => {
  var node = document.createElement('div');
  node.setAttribute('bind_test', 'value');
  expect(Node.prototype.bind.configure({bindingPrefix: 'bind-'}, node, {value:true})).toBe(node);
  expect(node.test).toBeUndefined();
});

test('configure(null, node[bind-testA=valueA][bind-testB=valueB], {valueA, valueB})', () => {
  var node = document.createElement('div');
  node.setAttribute('bind-testA', 'valueA');
  node.setAttribute('bind-testB', 'valueB');
  expect(Node.prototype.bind.configure(null, node, {valueA:1,valueB:2})).toBe(node);
  expect(node.testA||node.testa).toBe(1);
  expect(!!node.testA&&!!node.testa).toBe(false);
  expect(node.testB||node.testb).toBe(2);
  expect(!!node.testB&&!!node.testb).toBe(false);
});

test('configure(null, node[bind-textcontent=value], {value})', () => {
  var node = document.createElement('div');
  node.setAttribute('bind-textcontent', 'value');
  expect(Node.prototype.bind.configure(null, node, {value:'content'})).toBe(node);
  expect(node.textContent).toBe('content');
});

test('configure(null, node->node[bind-textcontent=value], {value})', () => {
  var parent = document.createElement('div');
  var child = parent.appendChild(document.createElement('div'));
  child.setAttribute('bind-textcontent', 'value');
  expect(Node.prototype.bind.configure(null, parent, {value:'content'})).toBe(parent);
  expect(parent.innerHTML).not.toBe('content');
  expect(parent.textContent).toBe('content');
  expect(child.innerHTML).toBe('content');
  expect(child.textContent).toBe('content');
  expect(parent.childNodes.length).toBe(1);
  expect(parent.childNodes[0]).toBe(child);
  expect(child.parentNode).toBe(parent);
});

test('configure(null, node[bind-testresult=value], {value.value})', () => {
  var model = {value:{value:true}};
  var node = document.createElement('div');
  node.setAttribute('bind-testresult', 'value');
  expect(Node.prototype.bind.configure(null, node, model)).toBe(node);
  expect(node.testresult).not.toBe(true);
});

test('configure(null, node[bind-testresult=value.value], {value.value})', () => {
  var model = {value:{value:true}};
  var node = document.createElement('div');
  node.setAttribute('bind-testresult', 'value.value');
  expect(Node.prototype.bind.configure(null, node, model)).toBe(node);
  expect(node.testresult).toBe(true);
});

test('configure(null, node[bind-result-result=value], {value})', () => {
  var model = {value:true};
  var node = document.createElement('div');
  node.setAttribute('bind-result-result', 'value');
  node.result = {};
  expect(Node.prototype.bind.configure(null, node, model)).toBe(node);
  expect(node.result.result).toBe(true);
});

test('configure(null, node[bind-result-result=value], {value.value})', () => {
  var model = {value:{value:true}};
  var node = document.createElement('div');
  node.setAttribute('bind-result-result', 'value');
  node.result = {};
  expect(Node.prototype.bind.configure(null, node, model)).toBe(node);
  expect(node.result.result).toBe(model.value);
});

test('configure(null, node[bind-result-result=value.value], {value.value})', () => {
  var model = {value:{value:true}};
  var node = document.createElement('div');
  node.setAttribute('bind-result-result', 'value.value');
  node.result = {};
  expect(Node.prototype.bind.configure(null, node, model)).toBe(node);
  expect(node.result.result).toBe(true);
});

test('child.bind -> parent.bind', () => {
  var parent = document.createElement('div');
  var child = parent.appendChild(document.createElement('div'));
  parent.setAttribute('bind-result', 'value');
  child.setAttribute('bind-result', 'value');
  child.bind({value:123});
  parent.bind({value:321});
  expect(child.result).toBe(123);
  expect(parent.result).toBe(321);
});

test('parent.bind -> child.bind -> parent.bind', () => {
  var parent = document.createElement('div');
  var child = parent.appendChild(document.createElement('div'));
  parent.setAttribute('bind-result', 'value');
  child.setAttribute('bind-result', 'value');
  parent.bind({value:123});
  child.bind({value:321});
  parent.bind({value:'abc'});
  expect(child.result).toBe('abc');
  expect(parent.result).toBe('abc');
});

test('parent.bind -> child.configure -> parent.bind', () => {
  var parent = document.createElement('div');
  var child = parent.appendChild(document.createElement('div'));
  parent.setAttribute('bind-result', 'value');
  child.setAttribute('bind-result', 'value');
  parent.bind({value:123});
  Node.prototype.bind.configure({}, child, {value:321});
  parent.bind({value:'abc'});
  expect(child.result).toBe(321);
  expect(parent.result).toBe('abc');
});
