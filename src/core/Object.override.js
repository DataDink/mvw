/**
* Copies only members from the source that the target already has default values for
* @function override
* @param {object} target - The object being copied to
* @param {object} source - The object being copied from
* @returns {object} The target object
*/
Object.override = // global
function override(target, source) {
  if (source && target) {
    for (var member in target) {
      if (member in source) {
        target[member] = source[member];
      }
    }
  }
  return target;
}
