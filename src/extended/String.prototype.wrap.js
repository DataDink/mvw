/**
* @dependencies:  n/a
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @notes:         Utility extension for wrapping text
*/

((ExtensionPoint, ExtensionName, Parser, Limit) => {
  if (ExtensionName in ExtensionPoint) { return; }
    Object.defineProperty(ExtensionPoint, ExtensionName, {
      enumerable:true, configurable: false, writable: false,
      value: Object.freeze(
        /**
        * @function wrap - Reformats a string to wrap at a limiting function
        * @parameter {number/function/RegExp} limiter - The limiter method
        * @returns {string} - The reformatted string
        */
        function wrap(limiter) {
          return this
            .split('\n')
            .map(block => Array.from(block.matchAll(Parser)))
            .flatMap(block => block.reduce((lines,next)=> {
              var withWord = lines[lines.length-1]+next.groups.word;
              if (Limit(withWord, limiter)) { lines[lines.length-1]=withWord; }
              else { lines.push(next.groups.word); }
              var withSpace = lines[lines.length-1]+(next.groups.space||'');
              if (Limit(withSpace, limiter)) { lines[lines.length-1]=withSpace; }
              return lines;
            }, ['']))
            .join('\n');
        }
      )
    });
})(
  /** @ExtensionPoint */ String.prototype,
  /** @ExtensionName  */ 'wrap',
  /** @Parser         */ /(?<word>\S+)(?<space>\s*)/g,
  /** @Limit          */ (test, limiter) => typeof(limiter)==='number'?test.length<=limiter
                                          : typeof(limiter)==='function'?limiter(test)
                                          : (limiter instanceof RegExp)?limiter.test(test)
                                          : false
);
