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
var rsync = require('../lib/rsync')

describe('rsync', function () {
  var src, dest

  beforeEach(function () {
    src = path.join(__dirname, 'backups/src/')
    dest = path.join(__dirname, 'backups/dest/')
    return when.join(mkdirp(src), mkdirp(dest))
      .then(function () {
        return when.join(
          writeFile(path.join(src, 'transferme'), 'transfer me'),
          writeFile(path.join(src, 'alreadythere'), 'no need to transfer me'),
          writeFile(path.join(dest, 'extraneous'), 'deleteme')
        ).then(function () {
          return exec([
            'ln',
            path.join(src, 'alreadythere'),
            path.join(dest, 'alreadythere')
          ])
        })
      })
  })

  afterEach(function () {
    return rimraf(path.dirname(src))
  })

  it('should transfer missing files', function () {
    return rsync(src, dest).then(shouldExist(path.join(dest, 'transferme'), true))
  })

  it('should state transfered files in output', function () {
    return rsync(src, dest).then(parseOutput)
      .then(function (actions) {
        expect(actions).to.contain('transferme')
      })
  })

  it('should not transfer files already at dest', function () {
    return rsync(src, dest).then(parseOutput)
      .then(function (actions) {
        expect(actions).to.not.contain('alreadythere')
      })
  })

  it('should transfer files already at dest if modified', function () {
    var existing = path.join(src, 'alreadythere')
    return rimraf(existing)
    .then(function () {
      writeFile(existing, 'actually im modified so transferme')
    })
    .then(function () {
      return rsync(src, dest).then(parseOutput)
        .then(function (actions) {
          expect(actions).to.contain('alreadythere')
        })
    })
  })

  it('should delete extraneous files at dest', function () {
    return rsync(src, dest).then(shouldExist(path.join(dest, 'extraneous'), false))
  })

  it('should state deletions in output', function () {
    return rsync(src, dest).then(parseOutput)
      .then(function (actions) {
        expect(actions).to.contain('deleting extraneous')
      })
  })

})

function parseOutput (output) {
  return output.split('\n')
}
