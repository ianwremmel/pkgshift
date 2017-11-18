const {exec} = require('child_process');
const path = require('path');

const debug = require('debug')('pkgshift:test:integration:lib:run');

/**
 * Run a command in the fixture directory.
 * @param {string} fixture
 * @param {string} cmd
 * @param {Object} [options]
 * @param {boolean} [options.stderr]
 * @returns {string}
 */
module.exports = function run(fixture, cmd, options = {}) {
  const bin = path.resolve(__dirname, '../../../bin/pkgshift');
  const dir = path.resolve(__dirname, '..', 'fixtures', fixture);

  debug(`changing directory to ${dir}`);
  process.chdir(dir);
  debug(`changed directory to ${dir}`);

  const toExec = `${bin} run ${cmd || ''}`;

  debug(`running ${toExec}`);

  return new Promise((resolve, reject) => {
    // pass {stdio: 'pipe'} to prevent output from being printed in the test
    // report.
    exec(toExec, {stdio: 'pipe'}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      if (options.stderr) {
        resolve(stderr);
        return;
      }

      resolve(stdout);
    });
  })
    .then((out) => out.toString()
      .trim());
};
