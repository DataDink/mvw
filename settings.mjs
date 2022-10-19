import * as FS from 'fs';
import Path from 'path';
import './src/extended/console-formatters.js';
import './src/extended/String.prototype.wrap.js';
const Package = JSON.parse(FS.readFileSync('./package.json').toString());
FS.writeFileSync('./package.json', JSON.stringify(Package, null, 3));

export const settings = {
  package: Package,
  version: Package.version,
  debugOutput: './dst/debug/',
  buildOutput: `./dst/v${Package.version}/`,
  releaseOutput: `./release/v${Package.version}/`,
  latestOutput: `./release/latest/`,
  webLocation: `https:github.com/DataDink/mvw/release/v${Package.version}/`,
  buildConfigs: [{
    name: 'minimal',
    sources: [
      './src/core/',
      './src/minimal/'
    ]
  },{
    name: 'standard',
    sources: [
      './src/core/',
      './src/minimal/',
      './src/standard/'
    ]
  },{
    name: 'extended',
    sources: [
      './src/core/',
      './src/minimal/',
      './src/standard/',
      './src/extended/'
    ]
  }],
  buildProfiles: [{
    extension: '.js',
    settings: {
      mangle: false,
      compress: false,
      format: { beautify: true, comments: 'some' }
    }
  }, {
    extension: '.min.js',
    settings: {
      mangle: { eval: true, keep_classnames: true },
      compress: true,
      format: { beautify: false, comments: false }
    }
  }],
  headerItems: [
    {name: 'product', formatter: path => `      ${Package.name} v${Package.version} - ${Package.description}`},
    {name: 'component', formatter: path => `    ${Path.parse(path).name}`},
    {name: 'license', formatter: path => `      ${Package.license}`},
    {name: 'documentation', formatter: path => `https://github.com/DataDink/mvw/wiki/${Path.parse(path).name}`},
    {name: 'source', formatter: path => `       https://github.com/DataDink/mvw/${Path.join('.', path)}`},
    {name: 'author', formatter: path => `       ${Package.author}`}
  ],
  headerWidth: 100,
  headerPrefix: '* @',
  headerDelim: ': ',
  headerParser: new RegExp([
    // /^\s*\/[\*]{2}[\s\*]+(?<content>.+?)[\s\*]*\*\//gis
    '^\\s*', // Must be at start of document
    '\\/[\\*]{2}', // Must start with: /**
    '[\\s\\*]+', // Pass over preceding empty lines & whitespace
    '(?<content>.+?)', // Grabs header content
    '[\\s\\*]*', // Pass over trailing empty lines & whitespace
    '\\*\\/' // Ends at the first: */
  ].join(''), 'gis'),
  headerItemParser: new RegExp([
    // /^[ \t]*\*[ \t]*@(?<name>[a-z0-9\-_]+)(?:(?<delim>[^a-z0-9\r\n]+)(?<desc>.*?)(?:[\s\*]*(?=^[ \t]*\*[ \t]*@)|[\s\*]*\*\/))?/gims
    '^', // Must be at the start of a new line
    '[ \\t]*\\*', // Must start with a '*'
    '[ \\t]*@', // The name must start with '@'
    '(?<name>[a-z0-9\\-_]+)', // Grabs the item's name
    '(?:', // Groups the delim and desc so they can be made optional
      '(?<delim>[^a-z0-9\r\n]+)', // Grabs the delim which must be on the same line as the name and description
      '(?<desc>.*?)', // Grabs the description
      '(?:', // Groups the description terminators
        '[\\s\\*]*(?=^[ \\t]*\\*[ \\t]*@)', // Terminates a description at the empty lines preceding another item
        '|[\\s\\*]*\\*\\/', // OR terminates a description at the empty lines preceding the header terminator: */
      ')', // The desc terminator group
    ')?', // The delim/desc group making the whole group optional
  ].join(''), 'gims'),
  importCode: async function importCode(path) {
    var content = await FS.promises.readFile(path, 'utf-8');
    var header = (content.match(settings.headerParser)||[])[0]||'';
    var items = settings.headerItems
      .map(item=>{return{ name: item.name, desc: item.formatter(path) };})
      .concat(
        Array.from(header.matchAll(settings.headerItemParser))
          .map(m=>{return{ name: m.groups.name, desc: (m.groups.desc||'').replace(/\n[\s\*]*/,' ')};})
      )
      .reduce((cat,item) =>
        (name => !(name in cat)&&(cat[name]=item.desc)&&cat||cat)
        (Object.keys(cat).find(k => k.toLowerCase()===item.name.toLowerCase())||item.name),
        {}
      );
    var column = Math.max(...Object.keys(items).map(i => i.length));
    return `/**\n${
      Object.keys(items).map(name =>
        `${settings.headerPrefix}${name}${settings.headerDelim}${' '.repeat(column-name.length)}`
        + items[name]
          .wrap(settings.headerWidth-(settings.headerPrefix.length+column+settings.headerDelim.length))
          .split('\n')
          .join('\n*'+' '.repeat(settings.headerPrefix.length+column+settings.headerDelim.length-1))
      ).join('\n')
    }\n*/\n\n${content.replace(settings.headerParser, '').trim()}`;
  },
  printBorder: () => console.log.write('\n').blink.black.yellowHighlight.write('*'.repeat(process.stdout.columns)).reset('\n'),
  clearTerminal: () => process.stdout.write('\u001b[H\u001b[2J\u001b[3J'),
}
