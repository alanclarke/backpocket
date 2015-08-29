/* globals describe beforeEach afterEach it */
var path = require('path')
var fs = require('fs')
var when = require('when')
var nodefn = require('when/node')
var expect = require('chai').expect
var rimraf = nodefn.lift(require('rimraf'))
var mkdirp = nodefn.lift(require('mkdirp'))
var writeFile = nodefn.lift(fs.writeFile)
var exec = require('../lib/exec')
var shouldExist = require('./lib/should-exist')
var pax = require('../lib/pax')

describe('pax', function () {
  var src, dest, file

  beforeEach(function () {
    src = path.join(__dirname, 'backups/src')
    dest = path.join(__dirname, 'backups/dest')
    file = 'file'
    return when.join(mkdirp(src), mkdirp(dest)).then(function () {
      return writeFile(path.join(src, file), 'hello')
    })
  })

  afterEach(function () {
    return rimraf(path.dirname(src))
  })

  it('should hardlink the files to the destination', function () {
    return pax(src, dest)
      .then(shouldExist(path.join(dest, file), true))
  })

  it('should not consume additional space', function () {
    return pax(src, dest)
      .then(function () {
        return when.join(
          exec(['du', '-sh', dest]),
          exec(['du', '-sh', path.dirname(dest)])
        )
        .then(function (sizes) {
          var destSize = sizes[0]
          var parentSize = sizes[1]
          expect(destSize).to.contain('4.0K')
          expect(parentSize).to.contain('4.0K')
        })
      })
  })

})
