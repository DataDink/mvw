const fs = require('fs');
const path = require('path');
const {minify} = require('terser');

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

fs.writeFileSync(
  './dst/mvw.js',
  `(() => {\n${contents}\n})();`
);

minify(contents)
  .then(out => fs.writeFileSync(
    './dst/mvw.minified.js',
    `(() => {${out.code}})();`)
  );
