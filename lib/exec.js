var nodefn = require('when/node')
var child_process = require('child_process')

function exec (args, opts, cb) {
  if (opts && opts.verbose) console.log(args.join(' '))
  var child = child_process.execFile(args[0], args.slice(1), opts, wrap(cb || opts, opts))
  if (opts && opts.verbose) {
    child.stdout.on('data', function (data) {
      console.log(String(data))
    })
  }
  return child
}

function wrap (cb, opts) {
  return function callback (err, stdout, stderr) {
    cb(err, stdout)
  }
}

module.exports = nodefn.lift(exec)
