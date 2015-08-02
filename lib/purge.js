var path = require('path')
var fs = require('fs')
var when = require('when')
var moment = require('moment')
var nodefn = require('when/node')
var rimraf = nodefn.lift(require('rimraf'))
var readdir = nodefn.lift(fs.readdir)
var stat = nodefn.lift(fs.stat)

module.exports = function purge (dir, age, opts) {
  return readdir(dir)
    .then(fullpath(dir))
    .then(filter(age))
    .then(remove(opts))
}

function parseAge (age) {
  age = age && age.match(/([\d\.]+)(\w+)/)
  return age && age.slice(1)
}

function remove (opts) {
  return function (directories) {
    return when.map(directories, function (dir) {
      if (opts && opts.verbose) console.log('deleting ' + dir)
      return rimraf(dir)
    })
  }
}

function fullpath (dir) {
  return function (directories) {
    return directories.map(function (name) {
      return path.join(dir, name)
    })
  }
}

function filter (age) {
  age = parseAge(age)
  var cutoff = moment().subtract(age[0], age[1] || 'days').toDate()
  return function (files) {
    return when.filter(files, function (file) {
      return stat(file).then(function (stats) {
        // file is older (has less ms) than the cutoff date
        return stats.ctime < cutoff
      })
    })
  }
}