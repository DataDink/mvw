import { promises as FS } from 'fs';
import * as Path from 'path';
import {minify as Minify} from 'terser';
import {settings as Settings} from './settings.mjs';

Promise.resolve()
  .then(() => Settings.printBorder())
  .then(() => console.log.bold.white(`Building MVW ${Settings.version}:\n`))
  .then(() => clean())
  .then(() => console.log(''))
  .then(() => buildAll())
  .then(() => console.log.bold.green(`Build Complete!`))
  .catch(e => {
    console.log.bold.red(`Build Failed:`);
    console.error(e);
  })
  .then(() => Settings.printBorder());

async function clean() {
  console.log.light(`Cleaning Debug Folder...`);
  await FS.rm(Settings.debugOutput, {recursive: true, force: true});
  await FS.mkdir(Settings.debugOutput, {recursive: true});
  console.log.light(`Cleaning Build Folder...`);
  await FS.rm(Settings.buildOutput, {recursive: true, force: true});
  await FS.mkdir(Settings.buildOutput, {recursive: true});
}

async function buildAll() {
  for (var config of Settings.buildConfigs) {
    await build(config.name, config.sources);
    console.log('');
  }
}

async function build(name, sources) {
  console.log.yellow(`Starting '${name}'...`);

  var document = '';
  for (var source of sources) {
    var items = [source];
    while (items.length) {
      var item = items.shift();
      if ((await FS.lstat(item)).isFile()) {
        document += await importFile(item);
      } else {
        items.push(
          ...(await FS.readdir(item))
          .map(fname => Path.join(item, fname))
        );
      }
    }
  }
  document += `;MVW.Settings.register('version', '${name}v${Settings.version}');`;

  name = `mvw.${name}`;
  var debugFN = `${name}.js`;
  var debugPT = Path.join(Settings.debugOutput, debugFN);
  await FS.writeFile(debugPT, document);
  console.log.light.green(`\t${debugPT}:\t${document.length} bytes`);

  for (var profile of Settings.buildProfiles) {
    var codeFN = `${name}${profile.extension}`;
    var codePT = Path.join(Settings.buildOutput, codeFN);
    var code = (await Minify(document, profile.Settings)).code;
    var output = `console.info("${Settings.webLocation}/${codeFN}");\n${code}\n\n`;
    await FS.writeFile(codePT, output);
    console.log.light.green(`\t${codePT}:\t${output.length} bytes`);
  }
}

async function importFile(path) {
  var content = await FS.readFile(path, 'utf-8');
  var header = (content.match(Settings.headerParser)||[])[0]||'';
  var items = Settings.headerItems
    .map(item=>{return{ name: item.name, desc: item.formatter(path) };})
    .concat(
      Array.from(header.matchAll(Settings.headerItemParser))
        .map(m=>{return{ name: m.groups.name, desc: (m.groups.desc||'').replace(/\n[\s\*]*/,' ')};})
    )
    .reduce((cat,item) =>
      (name => !(name in cat)&&(cat[name]=item.desc)&&cat||cat)
      (Object.keys(cat).find(k => k.toLowerCase()===item.name.toLowerCase())||item.name),
      {}
    );
  var column = Math.max(...Object.keys(items).map(i => i.length));
  var format = `/**\n${
    Object.keys(items).map(name =>
      `${Settings.headerPrefix}${name}${Settings.headerDelim}${' '.repeat(column-name.length)}`
      + items[name]
        .wrap(Settings.headerWidth-(Settings.headerPrefix.length+column+Settings.headerDelim.length))
        .split('\n')
        .join('\n*'+' '.repeat(Settings.headerPrefix.length+column+Settings.headerDelim.length-1))
    ).join('\n')
  }\n*/\n`;
  return `(MVWSourceFile => {\n${format}\n${content.replace(Settings.headerParser, '').trim()}}\n)('${path}');\n\n`;
}
