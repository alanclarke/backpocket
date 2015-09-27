var path = require('path')
var moment = require('moment')
var nodefn = require('when/node')
var mkdirp = nodefn.lift(require('mkdirp'))
var defaults = require('./defaults')
var rsync = require('./rsync')
var pax = require('./pax')
var purge = require('./purge')
var exists = require('./exists')

function bp (src, dest, opts) {
  opts = opts || {}
  var archive = getArchivePath(dest, opts)
  var latest = path.join(dest, 'latest')
  var purger = opts.purge && purge(dest, opts.purge, opts.verbose)

  return Promise.all([ purger, mkdirp(archive), mkdirp(latest) ])
    .then(checkIgnoreFile)
    .then(copyFiles)
    .then(symlink)

  function checkIgnoreFile () {
    var ignoreFilePath = path.join(dest, '.ignore')
    return exists(ignoreFilePath)
      .then(function (exists) {
        if (exists) opts.ignoreFile = ignoreFilePath
      })
  }

  function copyFiles () {
    return rsync(src, latest, opts)
  }

  function symlink () {
    return pax(latest, archive, opts.verbose)
  }

  function getArchivePath () {
    return path.join(dest, moment(opts.date).format(opts.format || defaults.format))
  }
}

module.exports = bp
