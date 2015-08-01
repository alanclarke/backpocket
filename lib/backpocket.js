var path = require('path')
var moment = require('moment')
var when = require('when')
var nodefn = require('when/node')
var mkdirp = nodefn.lift(require('mkdirp'))
var rsync = require('./rsync')
var pax = require('./pax')

function bp (src, opts) {
  var dest = process.cwd()
  var archive = path.join(dest, moment().format('YYYY-MM-DD_hh-mm-ss'))
  var latest = path.join(dest, 'latest')

  return when.join(mkdirp(archive), mkdirp(latest))
    .then(function copyFiles () {
      return rsync(src, latest, opts.verbose)
    })
    .then(function symlink () {
      return pax(latest, archive, opts.verbose)
    })
}

module.exports = bp
