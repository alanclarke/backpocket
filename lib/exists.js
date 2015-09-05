var nodefn = require('when/node')
var exists = nodefn.lift(require('fs-exists'))

module.exports = exists
