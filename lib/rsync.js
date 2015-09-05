var path = require('path')
var exists = require('./exists')
var exec = require('./exec')

module.exports = function rsync (src, dest, opts) {
  opts = opts || {}
  src = normalise(src)
  dest = normalise(dest)
  var args = [
    'rsync',
    '--verbose',
    '--archive',
    '--delete',
    '--safe-links'
  ]
  var ignore = path.join(dest, '.ignore')
  return exists(ignore).then(function (hasIgnoreFile) {
    if (hasIgnoreFile) args.push('--exclude-from', path.join(dest, '.ignore'))
    if (opts.ignore) {
      opts.ignore.forEach(function (file) {
        args.push('--exclude', file)
      })
    }
    args.push(src, dest)
    return exec(args, { verbose: opts.verbose })
  })
}

function normalise (filePath) {
  return path.resolve(filePath) + '/'
}
