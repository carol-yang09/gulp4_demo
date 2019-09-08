const minimist = require('minimist');

const envOption = {
  string: 'env',
  default: { env: 'development' }
}
const options = minimist(process.argv.slice(2), envOption);

exports.options = options;