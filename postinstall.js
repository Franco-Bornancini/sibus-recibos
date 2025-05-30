const fs = require('fs');
const path = require('path');

const fixPath = path.join(
  'node_modules',
  'csso',
  'node_modules',
  'mdn-data',
  'css',
  'syntaxes.json'
);

if (fs.existsSync(fixPath)) {
  fs.writeFileSync(fixPath, '{}');
  console.log('Fixed empty syntaxes.json file');
}