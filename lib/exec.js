var nodefn = require('when/node')
var child_process = require('child_process')

function exec (args, opts, cb) {
  args = args.slice()
  child_process.execFile(args.shift(), args, opts || cb, cb)
}

module.exports = nodefn.lift(exec)
