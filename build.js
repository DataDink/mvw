const fs = require('fs');
const path = require('path');
const {minify} = require('terser');
const package = JSON.parse(fs.readFileSync('./package.json').toString());
const format = (name, content) => `console.log("https://github.com/DataDink/mvw ${name} v${package.version}");`
                                + `\n(() => {${content}})();`;

build('core', [
  './src/core/'
]);
build('standard', [
  './src/core/',
  './src/standard/'
]);
build('extended', [
  './src/core/',
  './src/standard/',
  './src/extended/'
]);

function build(name, sources) {
  const files = sources
    .flatMap(source => fs.lstatSync(source).isFile()
      ? [source]
      : fs.readdirSync(source).map(n => path.join(source, n))
    );
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
    }
  }).then(out => fs.writeFileSync(
    `./dst/mvw.${name}.js`,
    format(name, out.code)
  ));
  minify(contents, {
    mangle: {
      eval: true,
      keep_classnames: true
    }
  }).then(out => fs.writeFileSync(
    `./dst/mvw.${name}.minified.js`,
    format(name, out.code)
  ));
}
