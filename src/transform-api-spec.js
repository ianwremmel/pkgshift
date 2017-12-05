/* eslint-env mocha */

const {assert} = require('chai');

const TransformAPI = require('./transform-api');

describe('TransformAPI()', () => {
  describe('setOrReplaceScript', () => {
    it('adds a new script whence there was none before', () => {
      const pkg = {scripts: {}};

      TransformAPI.setOrReplaceScript(pkg, {
        from: 'mocha .',
        name: 'test',
        to: 'nyc mocha .'
      });

      assert.equal(pkg.scripts.test, 'nyc mocha .');
    });

    it('modifies an exact-match existing script', () => {
      const pkg = {scripts: {test: 'mocha .'}};

      TransformAPI.setOrReplaceScript(pkg, {
        from: 'mocha .',
        name: 'test',
        to: 'nyc mocha .'
      });

      assert.equal(pkg.scripts.test, 'nyc mocha .');
    });

    it('refuses to modify an unrecognized exact-match existing script', () => {
      const pkg = {scripts: {test: 'mocha .'}};

      assert.throws(() => {
        TransformAPI.setOrReplaceScript(pkg, {
          from: 'mocha ./src',
          name: 'test',
          to: 'nyc mocha .'
        });
      }, 'Initial script "mocha ." does not match `from` expectation "mocha ./src"');
    });

    it('modifies a regex-match existing script', () => {
      const pkg = {scripts: {test: 'mocha . --blarg'}};

      TransformAPI.setOrReplaceScript(pkg, {
        from: /^mocha (.+?) (--.+?)$/,
        name: 'test',
        to: 'nyc mocha $2 $1'
      });

      assert.equal(pkg.scripts.test, 'nyc mocha --blarg .');
    });

    it('refuses to modify an unrecognized regex-match existing script', () => {
      const pkg = {scripts: {test: 'not-mocha .'}};

      assert.throws(() => {
        TransformAPI.setOrReplaceScript(pkg, {
          from: /^mocha (.+?) (--.+?)$/,
          name: 'test',
          to: 'nyc mocha $2 $1'
        });
      }, 'Initial script "not-mocha ." does not match `from` expectation "/^mocha (.+?) (--.+?)$/"');
    });

    it('refuses to replace an existing script if from is not specified as a match-all regex', () => {
      const pkg = {scripts: {test: 'mocha .'}};

      assert.throws(() => {
        TransformAPI.setOrReplaceScript(pkg, {
          name: 'test',
          to: 'nyc mocha .'
        });
      }, 'Refusing to replace existing script "mocha ." without a "from" matcher. If you don\'t care about the script you\'re replace, please use a match-all regex');

      assert.doesNotThrow(() => {
        TransformAPI.setOrReplaceScript(pkg, {
          from: /mocha \./,
          name: 'test',
          to: 'nyc mocha .'
        });
      });

      assert.equal(pkg.scripts.test, 'nyc mocha .');

    });
  });
});
