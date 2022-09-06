(() => {
  /**
  * Scans a string until a character from the characters string is found
  * @function scanUntil
  * @param {String} string - The string to scan
  * @param {String} characters - The characters to scan until
  * @param {Number} index - The index to start scanning from
  * @returns {Number} - The index located or -1
  */
  String.scanUntil = (string, characters, index = 0) => scan(string, characters, index, true);
  /**
  * Scans a string while a character from the characters string is found
  * @function scanWhile
  * @param {String} string - The string to scan
  * @param {String} characters - The characters to scan while
  * @param {Number} index - The index to start scanning from
  * @returns {Number} - The index located or -1
  */
  String.scanWhile = (string, characters, index = 0) => scan(string, characters, index, false);
  /**
  * Scans a string using the characters
  * @function scan
  * @param {String} string - The string to scan
  * @param {String} characters - The characters to scan with
  * @param {Number} index - The index to start scanning from
  * @returns {Number} - The index located or -1
  */
  function scan(string, characters, index, method) {
    if (index < 0) { return -1; }
    if (method) {
      while(index < string.length && characters.indexOf(string[index]) === -1) { index++; }
    } else {
      while(index < string.length && characters.indexOf(string[index]) !== -1) { index++; }
    }
    return index >= string.length ? -1 : index;
  }
})();
