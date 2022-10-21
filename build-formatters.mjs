import Path from 'path';
import './src/extended/console-formatters.js';
import './src/extended/String.prototype.wrap.js';
import {Settings} from './settings.mjs';

export const Formatters = {
  /**
  * @config moduleFormatters - Applied to each module in a build
  * @prop   name             - Used to identify the formatter
  * @prop   format           - function(path, content) to apply reformatting to the module
  */
  moduleFormatters: [{
    name: 'headers', // Keep this formatter first
    format: (path, content) => { // (re)formats code file headers with a standard set of values
      const extracted = (content.match(/^\s*\/\*\*\s*\n.+?\*\/\s*/s)||[])[0]||'';
      const headers = [
        { name: 'product', desc: `${Settings.package.name} v${Settings.package.version} - ${Settings.package.description}` },
        { name: 'component', desc: `${Path.parse(path).name}` },
        { name: 'license', desc: `${Settings.package.license}` },
        { name: 'documentation', desc: `https://github.com/DataDink/mvw/wiki/${Path.parse(path).name}` },
        { name: 'source', desc: `https://github.com/DataDink/mvw/${Path.join(Settings.releaseOutput, Path.basename(path))}` },
        { name: 'author', desc: `${Settings.package.author}` },
      ].concat(Array.from(
        (extracted)
          .matchAll(/^[ \t]*\*[ \t]*@(?<name>[a-z0-9\-_]+)(?:(?<delim>[^a-z0-9\r\n]+)(?<desc>.*?)(?:[\s\*]*(?=^[ \t]*\*[ \t]*@)|[\s\*]*\*\/))?/gism)
        ).map(m => { return { name: m.groups.name, desc: m.groups.desc }; })
      ).reduce((headers, header) => ((name, desc) =>
        name in headers ? headers : (headers[name]=desc)&&headers||headers
      )(header.name.toLowerCase(), header.desc.replace(/\n[\s\*]*/g, ' ')), {});

      const headerWidth = 100;
      const headerPrefix = '* @';
      const headerDelim = ':';
      const nameWidth = Math.max(...Object.keys(headers).map(name => name.length));
      const descWidth = headerWidth-headerPrefix.length-headerDelim.length-nameWidth;
      const descTabs = ' '.repeat(headerWidth-descWidth);
      return '/**\n'
           + Object.keys(headers)
                   .map(name => `${headerPrefix}${name}${headerDelim} ${
                     ' '.repeat(nameWidth-name.length)
                   }${
                     headers[name].wrap(descWidth).replace('\n', '\n*' + descTabs)
                   }`)
                   .join('\n')
           + '\n*/\n\n'
           + content.substr(extracted.length);
    }
  },{ // Wraps a code file in a closure with a debug value set to the file's path/name
    name: 'closure', // Keep this formatter last
    format: (path, content) => `((MVWDEBUGFILEIDENTIFIER) => {\n${content}\n})('${path}');\n\n`
  }],
  /**
  * @config buildFormatters - Applied to a build before compression
  * @prop   name            - Used to identify the formatter
  * @prop   format          - function(path, content) to apply reformatting to the module
  */
  buildFormatters: [{ // Creates a build-global function to support minification for Object.defineProperty
    name: 'defineProperty',
    format: (path, content) => (
      (function MVWAPPLYEXTENSION(target, name, config) {
        return Object.defineProperty(target, name, Object.assign(config, {
            enumerable: true, configurable: false
        }));
      }).toString()
      + content.replace(
        /(?<=Object.defineProperty\s*\([^\{]+?\{.+?)(?:(?:enumerable|configurable)\s*:\s*(?:true|false)\s*,\s*)/gis,
        '',
      )
      + '\n\n'
    ).replace(
      /Object\.defineProperty\s*\((?<target>[^,\)]+?),(?<name>[^\),]+?),\s*?\{/gis,
      (_, target, name) => `MVWAPPLYEXTENSION(${target}, ${name}, { `
    )
  },{ // Creates build-global versions of select global values to support minification
    name: 'globals',
    format: (path, content) =>
      'const MVWGLOBALROOTMEMBER = (function() {return this;})();\n'
      + [
        'Object',
        'Node',
        'Element',
        'HTMLElement',
        'EventTarget',
        'Symbol',
        'Array',
        'Attr',
        'Promise',
        'RegExp',
        'Proxy',
        'Event'
      ].map(name => `    const ${name}=MVWGLOBALROOTMEMBER.${name};`).join('\n')
      + '\n\n'
      + content
  },{ // Wraps a build file in a closure with a debug value set to the file's name
    name: 'closure', // Keep this formatter last
    format: (path, content) =>
      `console.info("${Settings.webLocation}${Path.basename(path)}");\n`
      + `((MVWDEBUGBUILDIDENTIFIER) => {\n${content}\n})('${path}');\n`
      + `MVW.Settings.register('version', '${Path.basename(path)} v${Settings.version}');\n\n`
  }],
  formatModule: function formatModule(path, content) {
    console.log.light.green(`  * Formatting '${path}':`)
    for (var formatter of this.moduleFormatters) {
      content = formatter.format(path, content);
      if (!content) { throw `formatter '${formatter.name}' failed for module '${path}'`; }
    }
    return content;
  },
  formatBuild: function formatBuild(path, content) {
    console.log.light.green(`  * Formatting '${Path.basename(path)}':`)
    for (var formatter of this.buildFormatters) {
      content = formatter.format(path, content);
      if (!content) { throw `formatter '${formatter.name}' failed for module '${path}'`; }
    }
    return content;
  },
}
