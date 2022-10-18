/**
* @license:       Unlicense - https://unlicense.org/
* @author:        DataDink - https://github.com/DataDink
* @dependencies:  n/a
* @notes:         Utility extension to simplify color console output
*/

((levels,formatter)=>(catalog=>
  levels.map(level=>console[level]).forEach(root=>
    Object.keys(catalog).filter(m=>!(m in root)).forEach(index=>
      Object.defineProperty(root,index,{
        enumerable: true, configurable: false,
        get: () => ((styles,write,log)=>(logger=>logger[index])(
          Object.keys(catalog).reduce((logger, method)=>
            Object.defineProperty(logger, method, {
              enumerable: true, configurable: false,
              get: () => typeof(catalog[method])==='function'
                ? function writer(input) { write(method,styles,input); return logger; } // <-- public
                : catalog.write(styles, catalog[method])&&logger||logger
            }),
            function logger(input) { log(styles,input); } // <-- public
          )
        ))(
          /** @styles */ [],
          /** @write  */ (method,styles,text) => catalog[method](styles,text),
          /** @log    */ (styles,text) => root(formatter(catalog,styles,text))
        )
      })
    )
  )
)(
  /** @catalog */
  (encode=>{return{
    debug: function(styles,input) { (input.levels=levels)&&(input.formatter=formatter)&&(input.catalog=this)&&(input.styles=styles); },
    write: (styles,input) => styles.push(input),
    writeline: (styles, input) => styles.push(input)&&styles.push('\n'),
    encode: (styles, input) => styles.push(encode(input)),
    reset: encode(0),
    bold: encode(1),
    light: encode(2),
    italic: encode(3),
    underscore: encode(4),
    blink: encode(5),
    invert: encode(7),
    hidden: encode(8),
    resetWeight: encode(22),
    resetItalic: encode(23),
    resetUnderscore: encode(24),
    resetBlink: encode(25),
    resetHide: encode(28),
    black: encode(30),
    red: encode(31),
    green: encode(32),
    yellow: encode(33),
    blue: encode(34),
    magenta: encode(35),
    cyan: encode(36),
    white: encode(37),
    resetColor: encode(39),
    blackHighlight: encode(40),
    redHighlight: encode(41),
    greenHighlight: encode(42),
    yellowHighlight: encode(43),
    blueHighlight: encode(44),
    magentaHighlight: encode(45),
    cyanHighlight: encode(46),
    whiteHighlight: encode(47),
    noHighlight: encode(47),
    resetHighlight: encode(49),
  }})(/** @encode */ id => `\x1b[${parseInt(id)||0}m`)
))(
  /** @levels    */ ['debug', 'info', 'log', 'warn', 'error'],
  /** @formatter */ (catalog,styles,input) => [...styles,input,catalog.reset].join('')
);
