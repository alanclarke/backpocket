/* globals describe beforeEach afterEach it */
var path = require('path')
var delay = require('when/delay')
var nodefn = require('when/node')
var rimraf = nodefn.lift(require('rimraf'))
var mkdirp = nodefn.lift(require('mkdirp'))
var shouldExist = require('./lib/should-exist')
var purge = require('../lib/purge')

describe('purge', function () {
  var dir

  beforeEach(function () {
    dir = path.join(__dirname, 'backups/deleteme')
    return mkdirp(dir)
  })

  afterEach(function () {
    return rimraf(path.dirname(dir))
  })

  it('should delete directories older than n units', function () {
    return delay(2)
      .then(function () {
        return purge(path.dirname(dir), '1milliseconds')
          .then(shouldExist(dir, false))
      })
  })

  it('should not delete directories younger than n units', function () {
    return purge(path.dirname(dir), '10seconds')
      .then(shouldExist(dir, true))
  })

})
