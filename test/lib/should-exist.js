var expect = require('chai').expect
var nodefn = require('when/node')
var exists = nodefn.lift(require('fs-exists'))

module.exports = function shouldExist (dir, expectation) {
  return function () {
    return exists(dir).then(function (exists) {
      expect(exists).to.eql(expectation)
    })
  }
}
