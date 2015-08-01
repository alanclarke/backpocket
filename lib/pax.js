var exec = require('./exec')

module.exports = function pax (src, dest, verbose) {
  return exec([ 'pax', '-rwl', '.', dest ], {
    cwd: src,
    verbose: verbose
  })
}
