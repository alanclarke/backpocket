var exec = require('./exec')

module.exports = function pax (src, dest) {
  return exec([ 'pax', '-rwl', '.', dest], {
    cwd: src
  })
}
