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
  if (opts.ignoreFile) args.push('--exclude-from', opts.ignoreFile)
  if (opts.ignore) {
    opts.ignore.forEach(function (file) {
      args.push('--exclude', file.replace(src, ''))
    })
  }
  args.push(src, dest)
  return exec(args, { verbose: opts.verbose })
}

function normalise (filePath) {
  return filePath.replace(/\/$/, '') + '/'
}
