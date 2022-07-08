/**
* Scans a string for a character from the search string
* @function scan
* @param {string} characters - The characters to scan for
* @param {number} index - The index to start searching from
* @param {bool} invert - If true, this instead scans for the first non-matching character
* @returns {number} - The index located or -1
*/
String.scan = function scan(string, characters, index=0, invert=false) {
  while(
    index < string.length
    && (invert
      ? characters.indexOf(string[index]) !== -1
      : characters.indexOf(string[index]) === -1
    )
  ) { index++; }
  return index === string.length ? -1 : index;
}
