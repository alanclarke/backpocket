/* globals describe beforeEach afterEach it */
var path = require('path')
var fs = require('fs')
var moment = require('moment')
var when = require('when')
var nodefn = require('when/node')
var rewire = require('rewire')
var sinon = require('sinon')
var expect = require('chai').expect
var rimraf = nodefn.lift(require('rimraf'))
var mkdirp = nodefn.lift(require('mkdirp'))
var writeFile = nodefn.lift(fs.writeFile)
var defaults = require('../lib/defaults')
var exec = require('../lib/exec')
var shouldExist = require('./lib/should-exist')
var backpocket = rewire('../lib/backpocket')

describe('rsync', function () {
  var src, dest, revertables

  beforeEach(function () {
    src = path.join(__dirname, 'backups/src/')
    dest = path.join(__dirname, 'backups/dest/')
    revertables = [
      backpocket.__set__('rsync', sinon.stub().returns(when.resolve())),
      backpocket.__set__('pax', sinon.stub().returns(when.resolve())),
      backpocket.__set__('purge', sinon.stub().returns(when.resolve()))
    ]
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
    while (revertables && revertables.length) revertables.pop()()
    return rimraf(path.dirname(src))
  })

  it('should create a latest dir', function () {
    return backpocket(src, dest)
      .then(shouldExist(path.join(dest, 'latest'), true))
  })

  it('should create an archive dir', function () {
    var d = moment()
    return backpocket(src, dest, {
      date: moment().toDate()
    }).then(shouldExist(path.join(dest, d.format(defaults.format)), true))
  })

  it('should rsync into latest dir', function () {
    return backpocket(src, dest).then(function () {
      expect(backpocket.__get__('rsync').calledWith(src, path.join(dest, 'latest'))).to.eql(true)
    })
  })

  it('should pax into archive dir', function () {
    var d = moment()
    return backpocket(src, dest, {
      date: d.toDate()
    }).then(function () {
      expect(backpocket.__get__('pax').calledWith(
        path.join(dest, 'latest'),
        path.join(dest, moment().format(defaults.format))
      )).to.eql(true)
    })
  })

  it('should not purge old files if -p is not enabled', function () {
    return backpocket(src, dest).then(function () {
      expect(backpocket.__get__('purge').called).to.eql(false)
    })
  })

  it('should purge old files if -p is enabled', function () {
    var age = '30days'
    return backpocket(src, dest, {
      purge: age
    }).then(function () {
      expect(backpocket.__get__('purge').calledWith(
        dest,
        age
      )).to.eql(true)
    })
  })

})
