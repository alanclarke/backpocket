var spawn = require('child_process').spawn

function exec (args, opts) {
  return new Promise(function (resolve, reject) {
    if (opts && opts.verbose) console.log(args.join(' '))
    var child = spawn(args[0], args.slice(1), opts)
    var result = []
    child.stdout.on('data', function (data) {
      data = String(data).trim()
      result.push(data)
      if (opts && opts.verbose) console.log(data)
    })
    var err = []
    child.stderr.on('data', function (data) {
      data = String(data).trim()
      err.push(data)
      if (opts && opts.verbose) console.error(data)
    })
    child.on('close', function (code) {
      if (code === 0) return resolve(result.join('\n'))
      return reject(err.join('\n'))
    })
  })
}

module.exports = exec
