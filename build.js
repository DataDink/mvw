const fs = require('node:fs/promises');
const path = require('path');
const {minify} = require('terser');
const package = JSON.parse(require('node:fs').readFileSync('./package.json').toString());

const settings = {
  debugOutput: './dst/debug/',
  buildOutput: `./dst/v${package.version}/`,
  webLocation: `https:github.com/DataDink/mvw/release/v${package.version}/`,
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
  stdOutDelim: `\n&black&bgyellow&blink&bright${'*'.repeat(process.stdout.columns)}&reset\n`,
}

Promise.resolve()
  .then(() => log(settings.stdOutDelim))
  .then(() => log(`&brightBuilding MVW ${package.version}:\n`))
  .then(() => clean())
  .then(() => log(''))
  .then(() => buildAll())
  .then(() => log(`&green&brightBuild Complete!`))
  .catch(e => log(`&red&brightBuild Failed: ${e}`))
  .then(() => log(settings.stdOutDelim));

async function clean() {
  log(`&dimCleaning Debug Folder...`);
  await fs.rm(settings.debugOutput, {recursive: true, force: true});
  await fs.mkdir(settings.debugOutput, {recursive: true});
  log(`&dimCleaning Build Folder...`);
  await fs.rm(settings.buildOutput, {recursive: true, force: true});
  await fs.mkdir(settings.buildOutput, {recursive: true});
}

async function buildAll() {
  for (var config of settings.buildConfigs) {
    await build(config.name, config.sources);
    log('');
  }
}

async function build(name, sources) {
  log(`&yellowStarting '${name}'...`);

  var document = '';
  for (var source of sources) {
    var items = [source];
    while (items.length) {
      var item = items.shift();
      if ((await fs.lstat(item)).isFile()) {
        var content = await fs.readFile(item, 'utf-8');
        document += `\n//${item} v${package.version}\n`
                 + `(() => {\n${content}\n})();\n`;
      } else {
        items.push(
          ...(await fs.readdir(item))
          .map(fname => path.join(item, fname))
        );
      }
    }
  }

  name = `mvw.${name}`;
  var debugFN = `${name}.js`;
  var debugPT = path.join(settings.debugOutput, debugFN);
  await fs.writeFile(debugPT, document);
  log(`\t&green&dim${debugPT}:\t${document.length} bytes`);

  for (var profile of settings.buildProfiles) {
    var codeFN = `${name}${profile.extension}`;
    var codePT = path.join(settings.buildOutput, codeFN);
    var code = (await minify(document, profile.settings)).code;
    var output = `console.log("${path.join(settings.webLocation,codeFN)}");\n${code}\n\n`;
    await fs.writeFile(codePT, output);
    log(`\t&green&dim${codePT}:\t${output.length} bytes`);
  }
}

function log(content) {
  var colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgblack: "\x1b[40m",
    bgred: "\x1b[41m",
    bggreen: "\x1b[42m",
    bgyellow: "\x1b[43m",
    bgblue: "\x1b[44m",
    bgmagenta: "\x1b[45m",
    bgcyan: "\x1b[46m",
    bgwhite: "\x1b[47m",
  };
  var search = Object.keys(colors).sort((a,b) => a.length > b.length ? 1 : -1);
  content = search.reduce((c,n) => c.replace(new RegExp(`&${n}`, 'gi'), colors[n]), content||'');
  console.log(`${content}${colors.reset}`);
}
