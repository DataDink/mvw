import { promises as FS } from 'fs';
import * as Path from 'path';
import {minify as Minify} from 'terser';
import {Settings} from './settings.mjs';
import {Formatters} from './build-formatters.mjs';

Promise.resolve()
  .then(() => Settings.clearTerminal())
  .then(() => Settings.printBorder())
  .then(() => console.log.bold.white(`Building MVW ${Settings.package.version}:\n`))
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
  console.log.yellow(`Building '${name}'...`);

  var document = '';
  for (var source of sources) {
    var items = [source];
    while (items.length) {
      var item = items.shift();
      if ((await FS.lstat(item)).isFile()) {
        var code = await FS.readFile(item, 'utf8');
        document += Formatters.formatModule(item, code);
      } else {
        items.push(
          ...(await FS.readdir(item))
              .map(fname => Path.join(item, fname))
        );
      }
    }
  }

  name = `${Settings.package.name}.${name}`;
  var debugFN = `${name}.js`;
  var debugPT = Path.join(Settings.debugOutput, debugFN);
  var debug = Formatters.formatBuild(debugPT, document);
  await FS.writeFile(debugPT, debug);
  console.log.bold.green(`Writing ${debugPT}:\t${debug.length} bytes`);

  for (var profile of Settings.buildProfiles) {
    var codeFN = `${name}${profile.extension}`;
    var codePT = Path.join(Settings.buildOutput, codeFN);
    var code = (await Minify(debug, profile.settings)).code;
    console.log.bold.green(`Writing ${codePT}:\t${code.length} bytes`);
    await FS.writeFile(codePT, code);
  }
  console.log('');
}
