import * as FS from 'fs';
import Path from 'path';
import './src/extended/console-formatters.js';
import './src/extended/String.prototype.wrap.js';
const Package = JSON.parse(FS.readFileSync('./package.json').toString());
FS.writeFileSync('./package.json', JSON.stringify(Package, null, 3));

export const Settings = {
  package: Package,
  debugOutput: './dst/debug/',
  buildOutput: `./dst/v${Package.version}/`,
  releaseOutput: `./release/v${Package.version}/`,
  latestOutput: `./release/latest/`,
  webLocation: `https:github.com/DataDink/mvw/release/v${Package.version}/`,
  /**
  * @config buildConfigs - Each of these describes a release tier
  * @prop   name         - Results in `mvw.{name}.js`, `mvw.{name}.min.js`, etc...
  * @prop   sources      - An array of directories or files to include
  */
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
  /**
  * @config buildProfiles - Each of these describes a minification profile
  * @prop   extension     - The suffix for the configuration (e.g. '.min.js')
  * @prop   settings      - The compression settings (see: https://github.com/terser/terser#minify-options)
  */
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
  printBorder: () => console.log.write('\n').blink.black.yellowHighlight.write('*'.repeat(process.stdout.columns)).reset('\n'),
  clearTerminal: () => process.stdout.write('\u001b[H\u001b[2J\u001b[3J'),
}
