import { promises as FS } from 'fs';
import * as Path from 'path';
import AdmZip from 'adm-zip';
import {settings as Settings} from './settings.mjs';

Promise.resolve()
  .then(() => Settings.clearTerminal())
  .then(() => Settings.printBorder())
  .then(() => console.log.bold.white(`Packing MVW ${Settings.version} Release:\n`))
  .then(() => clean())
  .then(() => copy())
  .then(() => zip())
  .then(() => bump())
  .then(() => console.log.bold.green(`Release Complete!`))
  .catch(e => {
    console.log.bold.red(`Release Failed:`);
    console.error(e);
  })
  .then(() => Settings.printBorder());

async function clean() {
  console.log.light(`Cleaning Latest Folder...`);
  await FS.rm(Settings.latestOutput, {recursive: true, force: true});
  await FS.mkdir(Settings.latestOutput, {recursive: true});
  console.log.light(`Cleaning Release Folder...`);
  await FS.rm(Settings.releaseOutput, {recursive: true, force: true});
  await FS.mkdir(Settings.releaseOutput, {recursive: true});
  console.log('');
}

async function copy() {
  console.log.yellow('Copying builds...');
  for (var file of await FS.readdir(Settings.buildOutput)) {
    var source = Path.join(Settings.buildOutput, file);
    var release = Path.join(Settings.releaseOutput, Path.basename(source));
    console.log.light.green(`${source}\t-> ${release}`);
    await FS.copyFile(source, release);
    var latest = Path.join(Settings.latestOutput, Path.basename(source));
    console.log.light.green(`${source}\t-> ${latest}`);
    await FS.copyFile(source, latest);
  }
  console.log('');
}

async function zip() {
  console.log.yellow('Packing source...')
  var archive = new AdmZip();
  for (var config of Settings.buildConfigs) {
    var name = `${Settings.package.name}-${config.name}-v${Settings.version}.zip`;
    console.log.light.green(`${name}`);
    var build = new AdmZip();
    var sources = Array.from(config.sources);
    while (sources.length) {
      var source = sources.shift();
      if ((await FS.lstat(source)).isFile()) {
        var code = await Settings.importCode(source);
        console.log.light(`\t${source}`);
        build.addFile(source, Buffer.from(code, 'utf-8'));
      } else {
        sources.push(
          ...(await FS.readdir(source))
          .map(fname => Path.join(source, fname))
        );
      }
    }
    var buffer = await new Promise((s,e)=>build.toBuffer(s,e));
    archive.addFile(name, buffer);
  }
  var target = Path.join(Settings.releaseOutput, `${Settings.package.name}-${Settings.version}.source.zip`);
  console.log.yellow(`Writing archive: ${target}\n`);
  archive.writeZip(target);
}

async function bump() {
  var newVersion = (split => {
    split[split.length-1]=`${(parseInt(split[split.length-1])||0)+1}`;
    return split.join('.');
  })(Array.from(Settings.version.matchAll(/\d+/g)));
  console.log.yellow(`Bumping version ${Settings.version}->${Settings.package.version=Settings.version=newVersion}\n`);
  await FS.writeFile('./package.json', JSON.stringify(Settings.package, null, 3));
}
