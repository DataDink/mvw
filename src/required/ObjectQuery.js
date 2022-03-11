/*
 *  ObjectQuery:
 *  Executes a selector query on an object and provides a
 *  value getter/setter along with additional details about
 *  the result of the query.
 *
 *  Usage:
 *  new ObjectQuery((object)object, (string)selector[, (bool)matchExistingCase])
 *
 *  Example:
 *  var query = new ObjectQuery({member1: {member2: 123}}, 'member1.member2');
 *  JSON.stringify(query);
 *
 *  Result:
 *  {
 *    "complete": true,
 *    "binding": {"member2": 123},
 *    "property": "member2",
 *    "value": 123
 *  }
 */
class ObjectQuery {
  complete;
  binding;
  property;
  get value() { if (this.complete) { return this.binding[this.property]; } }
  set value(value) { if (this.complete) { this.binding[this.property] = value; } }
  constructor(object, selector, matchExistingCase = false) {
    var query = Array.from(selector.matchAll(/[^\.]+/g)).map(match => match[0]);
    while (object != null && query.length) {
      this.property = matchExistingCase
        ? ObjectQuery.#matchMemberCase(object, query.shift())
        : query.shift();
      object = (this.binding = object)[this.property];
    }
    this.complete = !query.length && this.binding != null;
  }
  static #matchMemberCase(object, name) {
    if (name in object) { return name; }
    var lower = name.toLowerCase();
    while (object != null) {
      var match = Object.getOwnPropertyNames(object)
        .find(m => m.toLowerCase() === lower);
      if (match != null) { return match; }
      object = Object.getPrototypeOf(object);
    }
    return name;
  }
}
