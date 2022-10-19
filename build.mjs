import { promises as FS } from 'fs';
import * as Path from 'path';
import {minify as Minify} from 'terser';
import {settings as Settings} from './settings.mjs';

Promise.resolve()
  .then(() => Settings.clearTerminal())
  .then(() => Settings.printBorder())
  .then(() => console.log.bold.white(`Building MVW ${Settings.version}:\n`))
  .then(() => clean())
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
  console.log('');
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
        var code = await Settings.importCode(item);
        document += `(DEBUG_FILE_SOURCE => {\n${code}\n})('${item}');\n\n`;
      } else {
        items.push(
          ...(await FS.readdir(item))
          .map(fname => Path.join(item, fname))
        );
      }
    }
  }
  document += `;MVW.Settings.register('version', '${name}v${Settings.version}');`;

  name = `${Settings.package.name}.${name}`;
  var debugFN = `${name}.js`;
  var debugPT = Path.join(Settings.debugOutput, debugFN);
  await FS.writeFile(debugPT, document);
  console.log.light.green(`\t${debugPT}:\t${document.length} bytes`);

  for (var profile of Settings.buildProfiles) {
    var codeFN = `${name}${profile.extension}`;
    var codePT = Path.join(Settings.buildOutput, codeFN);
    var code = (await Minify(document, profile.settings)).code;
    var output = `console.info("${Settings.webLocation}${codeFN}");\n${code}\n\n`;
    await FS.writeFile(codePT, output);
    console.log.light.green(`\t${codePT}:\t${output.length} bytes`);
  }
}
