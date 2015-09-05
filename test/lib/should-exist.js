var expect = require('chai').expect
var exists = require('../../lib/exists')

module.exports = function shouldExist (dir, expectation) {
  return function () {
    return exists(dir).then(function (exists) {
      expect(exists).to.eql(expectation)
    })
  }
}
