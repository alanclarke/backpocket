var path = require('path')
var moment = require('moment')
var when = require('when')
var nodefn = require('when/node')
var mkdirp = nodefn.lift(require('mkdirp'))
var defaults = require('./defaults')
var rsync = require('./rsync')
var pax = require('./pax')
var purge = require('./purge')

function bp (src, dest, opts) {
  opts = opts || {}
  var archive = getArchivePath(dest, opts)
  var latest = path.join(dest, 'latest')
  var purger = opts.purge && purge(dest, opts.purge, opts.verbose)

  return when.all([ purger, mkdirp(archive), mkdirp(latest) ])
    .then(function copyFiles () {
      return rsync(src, latest, opts)
    })
    .then(function symlink () {
      return pax(latest, archive, opts.verbose)
    })
}

function getArchivePath (dest, opts) {
  return path.join(dest, moment(opts.date).format(opts.format || defaults.format))
}

module.exports = bp
