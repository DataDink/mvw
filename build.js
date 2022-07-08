const fs = require('fs');
const path = require('path');
const {minify} = require('terser');
const package = JSON.parse(fs.readFileSync('./package.json').toString());
const header = `console.log("https://github.com/DataDink/mvw v${package.version}");`
             + '\n(() => {';
const footer = '})();';

build('core', [
  './src/core/'
]);
build('standard', [
  './src/core/',
  './src/standard/'
]);
build('extras', [
  './src/core/',
  './src/standard/',
  './src/extras/'
]);

function build(name, directories) {
  const files = [
    ...directories
      .flatMap(dir => fs.readdirSync(dir)
        .map(n => path.join(dir, n))
      )
  ];
  const contents = files
    .map(file => fs.readFileSync(file))
    .map(content => content.toString().replace(/^\s+|\s+$/g, ''))
    .join(';\n\n');
  !fs.existsSync('dst') && fs.mkdirSync('dst');
  minify(contents, {
    mangle: false,
    compress: false,
    format: {
      beautify: true
    },
    keep_classnames: true
  }).then(out => fs.writeFileSync(
    `./dst/mvw.${name}.js`,
    `${header}${out.code}${footer}`
  ));
  minify(contents, {
    mangle: {eval: true},
    keep_classnames: true
  }).then(out => fs.writeFileSync(
    `./dst/mvw.${name}.minified.js`,
    `${header}${out.code}${footer}`
  ));
}
