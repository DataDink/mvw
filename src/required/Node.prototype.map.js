/*
 *  Node.prototype.map:
 *  Extends Node with a map method accepting an object that will
 *  map values from the model to properties on the elements based
 *  on attribute configurations on the elements
 *
 *  Usage:
 *  <span data-property="model.value"></span>
 *
 *  Example:
 *  var element = document.createElement('span');
 *  element.setAttribute('data-textContent', 'value'); // equiv to element.textContent = model.value
 *  element.map({value: 'test'});
 *
 *  Result:
 *  <span data-textContent="value">test</span>
 */
Node.prototype.map = function(model) {
  const Prefix = /^data\-/i;
  var view = this;
  Array.from(view.attributes || [])
       .filter(attribute => Prefix.test(attribute.name))
       .forEach(attribute => {
         var modelQuery = new ObjectQuery(model, attribute.value, false);
         var value = typeof(modelQuery.value) === 'function'
           ? modelQuery.value.bind(modelQuery.binding)
           : modelQuery.value;
         var elementSelector = attribute.name.replace(Prefix, '').replace(/\-+/g, '.');
         var elementQuery = new ObjectQuery(view, elementSelector, true);
         elementQuery.value = value;
       });
  Array.from(view.childNodes)
       .forEach(node => node.map(model));
  return view;
}
