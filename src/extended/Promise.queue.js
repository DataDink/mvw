/**
* Enumerates a sequential processor until a non-promise value is produced
* Compliments Promise.all and Promise.race
* Similar to Array.prototype.reduce
* This can also be accomplished using a async/await loop.
* @function queue
* @param {Function} next - The sequential processor
* @param {Object} initialValue - The starting value passed to `next`
* @returns {Promise} - The next promise
*/
Promise.queue = function queue(next, initialValue = null) {
  var value = next(initialValue);
  return (value instanceof Promise)
    ? value.then(v => Promise.queue(next, v))
    : Promise.resolve(value);
}
