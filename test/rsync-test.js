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
  var paths

  beforeEach(function () {
    setPaths()
    return makeFiles()
  })

  afterEach(function () {
    return rimraf(path.join(__dirname, 'backups'))
  })

  it('should transfer missing files', function () {
    return rsync(paths.src.dir, paths.dest.dir)
      .then(shouldExist(paths.dest.transferMe, true))
  })

  it('should state transfered files in output', function () {
    return rsync(paths.src.dir, paths.dest.dir)
      .then(parseOutput)
      .then(function (actions) {
        expect(actions).to.contain('transferMe')
      })
  })

  it('should not transfer files already at dest', function () {
    return rsync(paths.src.dir, paths.dest.dir)
      .then(parseOutput)
      .then(function (actions) {
        expect(actions).to.not.contain('allreadyThere')
      })
  })

  describe('when file is allready at dest, but modified', function () {
    beforeEach(function () {
      return rimraf(paths.src.allreadyThere)
        .then(function () {
          return writeFile(paths.src.allreadyThere, 'modified')
        })
    })

    it('should transfer the file', function () {
      return rsync(paths.src.dir, paths.dest.dir)
        .then(parseOutput)
        .then(function (actions) {
          expect(actions).to.contain('allreadyThere')
        })
    })
  })

  it('should delete extraneous files at dest', function () {
    return rsync(paths.src.dir, paths.dest.dir)
      .then(shouldExist(paths.dest.deleteMe, false))
  })

  it('should state deletions in output', function () {
    return rsync(paths.src.dir, paths.dest.dir)
      .then(parseOutput)
      .then(function (actions) {
        expect(actions).to.contain('deleting deleteMe')
      })
  })

  describe('ignore', function () {
    it('should ignore files specified by ignore', function () {
      return rsync(paths.src.dir, paths.dest.dir, {
        ignore: [ paths.src.transferMe ]
      })
      .then(shouldExist(paths.dest.transferMe, false))
    })
  })

  describe('.ignore', function () {
    beforeEach(function () {
      return writeFile(
        path.join(paths.dest.dir, '.ignore'),
        paths.src.transferMe.replace(paths.src.dir, '')
      )
    })
    it('should ignore files specified by .ignore', function () {
      return rsync(paths.src.dir, paths.dest.dir)
        .then(shouldExist(paths.dest.transferMe, false))
    })
  })

  function setPaths () {
    paths = {}
    var folders = ['src', 'dest']
    folders.forEach(function (name) {
      paths[name] = { dir: path.join(__dirname, 'backups', name) }
      paths[name].transferMe = path.join(paths[name].dir, 'transferMe')
      paths[name].deleteMe = path.join(paths[name].dir, 'deleteMe')
      paths[name].allreadyThere = path.join(paths[name].dir, 'allreadyThere')
      paths[name]['.ignore'] = path.join(paths[name].dir, 'allreadyThere')
    })
  }

  function makeFiles () {
    return when.join(mkdirp(paths.src.dir), mkdirp(paths.dest.dir))
      .then(function () {
        return when.join(
          writeFile(paths.src.transferMe, 'transferMe'),
          writeFile(paths.src.allreadyThere, 'allreadyThere'),
          writeFile(paths.dest.deleteMe, 'deleteMe')
        ).then(function () {
          return exec([
            'ln',
            paths.src.allreadyThere,
            paths.dest.allreadyThere
          ])
        })
      })
  }
})

function parseOutput (output) {
  return output.split('\n')
}
