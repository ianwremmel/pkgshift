/* eslint-env mocha */

const {assert} = require('chai');

const {apply} = require('.');

describe('apply()', () => {
  it('transforms a package with a synchronous transform', async() => {
    const target = {name: 'ALL_CAPS_NAME'};

    /**
     * A trivial transform function
     * @private
     * @param {Package} pkg
     * @returns {Promise<Package>}
     */
    function tx(pkg) {
      pkg.name = pkg.name.toLowerCase();
      return pkg;
    }

    const result = await apply(tx, target);

    assert.deepEqual(result, {name: 'all_caps_name'});
  });

  it('transforms a package with an synchronous transform', async() => {
    const target = {name: 'ALL_CAPS_NAME'};

    /**
     * A trivial transform function
     * @private
     * @param {Package} pkg
     * @returns {Promise<Package>}
     */
    function tx(pkg) {
      pkg.name = pkg.name.toLowerCase();
      return Promise.resolve(pkg);
    }

    const result = await apply(tx, target);

    assert.deepEqual(result, {name: 'all_caps_name'});
  });

  it('alerts the user if the transform appears malformed', async() => {
    const target = {name: 'ALL_CAPS_NAME'};

    /**
     * A trivial transform function
     * @private
     * @param {Package} pkg
     * @returns {undefined}
     */
    function tx(pkg) {
      pkg.name = pkg.name.toLowerCase();
    }

    try {
      await apply(tx, target);
      assert.fail('apply should have thrown when tx produced an invalid result');
    }
    catch (err) {
      assert.match(err, /tx did not produce a result; did you forget to return your result?/);
    }
  });
});
