var fs = require('fs')
module.exports = function exists (path) {
  return new Promise(fs.exists.bind(fs, path))
}
