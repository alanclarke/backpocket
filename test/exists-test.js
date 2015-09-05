/* globals describe beforeEach afterEach it */
var path = require('path')
var fs = require('fs')
var nodefn = require('when/node')
var expect = require('chai').expect
var rimraf = nodefn.lift(require('rimraf'))
var writeFile = nodefn.lift(fs.writeFile)
var exists = require('../lib/exists')

describe('exists', function () {
  var filePath
  beforeEach(function () {
    filePath = path.join(__dirname, 'amihere')
  })
  afterEach(function () {
    return rimraf(filePath)
  })

  describe('when the file exists', function () {
    beforeEach(function () {
      return writeFile(filePath, 'hello')
    })
    it('should return true', function () {
      return exists(filePath).then(function (result) {
        expect(result).to.eql(true)
      })
    })
  })
  it('should return false', function () {
    return exists(filePath).then(function (result) {
      expect(result).to.eql(false)
    })
  })
})
