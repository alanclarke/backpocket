var nodefn = require('when/node')
var child_process = require('child_process')

function exec (args, opts, cb) {
  if (opts && opts.verbose) console.log(args.join(' '))
  return child_process.execFile(args[0], args.slice(1), opts, wrap(cb || opts, opts))
}

function wrap (cb, opts) {
  return function callback (err, stdout, stderr) {
    if (opts && opts.verbose) console.log(stdout)
    cb(err)
  }
}

module.exports = nodefn.lift(exec)
