var backpocket = require('../lib/backpocket.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(3);
    // tests here
    var args = ['node', 'backpocket', 'src', 'dest'];
    test.deepEqual(backpocket.getargs(args), {src:'src', dest:'dest'}, 'Parsed arguments should only contain src and dest');

    args = ['node', 'backpocket','--ignore', 'ignore1', 'src', 'dest', '--idkey', 'idkey1'];
    test.deepEqual(backpocket.getargs(args), {src:'src', dest:'dest', 'ignore':'ignore1', 'idkey':'idkey1'}, 'Parsed arguments should contain specified options');

    args = ['node', 'backpocket','--ignore', 'ignore1', 'src', '--idkey', 'idkey1', 'dest'];
    test.deepEqual(backpocket.getargs(args), {src:'src', dest:'dest', 'ignore':'ignore1', 'idkey':'idkey1'}, 'Parsed arguments should contain specified options');

    test.done();
  }
};
