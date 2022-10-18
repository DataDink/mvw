import * as fs from 'fs';
import path from 'path';
import './src/extended/console-formatters.js';
import './src/extended/String.prototype.wrap.js';
const Package = JSON.parse(fs.readFileSync('./package.json').toString());

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
    {name: 'product', formatter: file => `      ${Package.name} v${Package.version} - ${Package.description}`},
    {name: 'component', formatter: file => `    ${path.parse(file).name}`},
    {name: 'license', formatter: file => `      ${Package.license}`},
    {name: 'documentation', formatter: file => `https://github.com/DataDink/mvw/wiki/${path.parse(file).name}`},
    {name: 'source', formatter: file => `       https://github.com/DataDink/mvw/${path.join('.', file)}`},
    {name: 'author', formatter: file => `       ${Package.author}`}
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
  printBorder: () => console.log.write('\n').blink.black.yellowHighlight.write('*'.repeat(process.stdout.columns)).reset('\n'),
}
