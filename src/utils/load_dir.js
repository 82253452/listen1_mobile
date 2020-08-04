const fs = require('fs');
const path = require('path');

const load = function (path, name) {
  if (name) {
    return require(path + name);
  }
  return require(path);
};

module.exports = function (dir) {
  patcher = {};

  fs.readdirSync(__dirname + '/' + dir).forEach(function (filename) {
    if (!/\.js$/.test(filename)) {
      return;
    }
    const name = path.basename(filename, '.js');
    const _load = load.bind(null, './' + dir + '/', name);

    patcher.__defineGetter__(name, _load);
  });

  return patcher;
};
