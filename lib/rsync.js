var path = require('path')
var exec = require('./exec')

module.exports = function rsync (src, dest, verbose) {
  var args = [
    'rsync',
    '--archive',
    '--delete',
    '--safe-links',
    '--exclude-from',
    path.join(__dirname, '.ignore'),
    src,
    dest
  ]
  if (verbose) args.splice(1, 0, '--verbose')
  return exec(args, { verbose: verbose })
}
