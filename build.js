const fs = require('fs');
const path = require('path');
const {minify} = require('terser');

const package = JSON.parse(fs.readFileSync('./package.json').toString());

const directories = [
  './src/required/',
  './src/optional/'
];

const files = [
  ...directories
    .flatMap(dir => fs.readdirSync(dir)
      .map(name => path.join(dir, name))
    )
];

const contents = files
  .map(file => fs.readFileSync(file))
  .map(content => content.toString().replace(/^\s+|\s+$/g, ''))
  .join('\n\n');

!fs.existsSync('dst') && fs.mkdirSync('dst');

const header = `console.log("https://github.com/DataDink/mvw v${package.version}");`
             + '\n(() => {';
const footer = '})();';

fs.writeFileSync(
  './dst/mvw.js',
  `${header}${contents}${footer}`
);

minify(contents)
  .then(out => fs.writeFileSync(
    './dst/mvw.minified.js',
    `${header}${out.code}${footer}`
  ));
