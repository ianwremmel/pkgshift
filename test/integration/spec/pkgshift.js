const {execSync} = require('child_process');
const path = require('path');

const {assert} = require('chai');

const {read} = require('../../../src/lib/package');
const run = require('../lib/run');

describe('pkgshift', () => {
  afterEach(() => {
    execSync('git checkout .', {cwd: path.resolve(__dirname, '../fixtures')});
  });

  it('transforms ./package.json with ./transform.js', async() => {
    const beforePkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
    assert.equal(beforePkg.name, 'my-package');
    await run('toupper');
    const afterPkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
    assert.equal(afterPkg.name, 'MY-PACKAGE');
  });

  describe('--verbose', () => {
    it('controls the output level', async() => {
      let result = await run('noop', '-v', {
        stderr: true,
        stdout: false
      });
      assert.include(result, 'pkgshift:index');
      assert.notInclude(result, 'pkgshift:lib');

      result = await run('noop', '-vv', {
        stderr: true,
        stdout: false
      });
      assert.include(result, 'pkgshift:index');
      assert.include(result, 'pkgshift:lib');

      // result = await run('noop', '-vvv', {
      //   stderr: true,
      //   stdout: false
      // });
      // assert.include(result, 'pkgshift:index');
      // assert.include(result, 'pkgshift:lib');
    });
  });

  describe('--dry-run', () => {
    it('executes the transform but does not apply it', async() => {
      const beforePkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
      assert.equal(beforePkg.name, 'my-package');
      await run('noop', '--dry');
      const afterPkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
      assert.equal(afterPkg.name, 'my-package');
    });
  });

  describe('--print --json', () => {
    describe('with --dry', () => {
      it('executes and prints the transform but does not apply it', async() => {
        const beforePkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
        assert.equal(beforePkg.name, 'my-package');
        const result = await run('toupper', '--dry --json --print');
        const afterPkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
        assert.equal(afterPkg.name, 'my-package');
        assert.equal(result, `{
  "name": "MY-PACKAGE",
  "version": "0.0.0"
}`);
      });
    });

    describe('without --dry-run', () => {
      it('executes, prints, and pplies the transform', async() => {
        const beforePkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
        assert.equal(beforePkg.name, 'my-package');
        const result = await run('toupper', '--json --print');
        const afterPkg = await read(path.resolve(__dirname, '../fixtures/toupper/package.json'));
        assert.equal(afterPkg.name, 'MY-PACKAGE');
        assert.equal(result, `{
  "name": "MY-PACKAGE",
  "version": "0.0.0"
}`);
      });
    });
  });

  describe('--transform', () => {
    it('applies a different transform than the noop', async() => {
      const beforePkg = await read(path.resolve(__dirname, '../fixtures/noop/package.json'));
      assert.equal(beforePkg.name, 'my-package');
      await run('noop', '--transform ../toupper/transform.js');
      const afterPkg = await read(path.resolve(__dirname, '../fixtures/noop/package.json'));
      assert.equal(afterPkg.name, 'MY-PACKAGE');
    });
  });

  describe('[path]', () => {
    it('applies the transform to a different file', async() => {
      const beforePkg = await read(path.resolve(__dirname, '../fixtures/noop/package.json'));
      assert.equal(beforePkg.name, 'my-package');
      await run('toupper', '--transform ../noop/transform.js');
      const afterPkg = await read(path.resolve(__dirname, '../fixtures/noop/package.json'));
      assert.equal(afterPkg.name, 'my-package');
    });
  });
});
