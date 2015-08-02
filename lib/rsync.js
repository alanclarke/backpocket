var path = require('path')
var exec = require('./exec')

module.exports = function rsync (src, dest, verbose) {
  var args = [
    'rsync',
    '--verbose',
    '--archive',
    '--delete',
    '--safe-links',
    '--exclude-from',
    path.join(__dirname, '.ignore'),
    src,
    dest
  ]
  return exec(args, { verbose: verbose })
}
