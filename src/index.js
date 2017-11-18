const path = require('path');
const util = require('util');

const invariant = require('invariant');

const {d, f} = require('./lib/debug')(__filename);
const {read, write} = require('./lib/package');

exports.exitCodes = require('./lib/exit-codes');

/**
 * @typedef {Object} Package
 * @description The {@link Object} defined by a package.json
 */

/**
 * @callback transformCallback
 * @param {Package} pkg
 * @returns {Package|Promise<Package>}
 */

/**
 * Asynchronously apply the specified transform to the specified package.
 * @param {transformCallback} tx
 * @param {Package} pkg
 * @returns {Promise<Package>}
 */
async function apply(tx, pkg) {
  const result = await new Promise((resolve) => resolve(tx(pkg)));
  if (!result) {
    throw new Error('tx did not produce a result; did you forget to return your result?');
  }
  return result;
}

exports.apply = apply;

/**
 * @typedef {Object} PkgShiftOptions
 * @property {string} path - File to transform
 * @property {string} transform - Path to the transform file.
 * @property {number} verbose - Show more information about the transform
 * process
 * @property {boolean} dry - Dry run (no changes are made to files)
 * @property {boolean} print - Print output, useful for development
 * @property {boolean} silent - No output
 */

/**
 * Main command line entry point
 * @param {PkgShiftOptions} options
 */
async function pkgshift(options = {}) {
  d(f`loading transform ${options.transform}`);
  const tx = await loadTransform(options.transform);
  d(f`loaded transform ${options.transform}`);

  d(f`loading package ${options.path}`);
  const pkg = await read(options.path);
  d(f`loaded package ${options.path}`);

  d(f`transforming package ${options.path}`);
  const result = await apply(tx, pkg);
  d(f`transformed package ${options.path}`);

  if (options.print) {
    d(f`printing result`);
    if (options.json) {
      d(f`printing result as JSON`);
      console.log(JSON.stringify(result, null, 2));
    }
    else {
      d(f`printing result with inspect`);
      console.log(util.inspect(result, {depth: null}));
    }
    d(f`printed result`);
  }

  if (!options.dry) {
    d(f`writing package ${options.path}`);
    await write(options.path, pkg);
    d(f`wrote package ${options.path}`);
  }
}

exports.pkgshift = pkgshift;

/**
 * Loads a transform function via require
 * @param {string} name
 * @returns {Function}
 */
async function loadTransform(name) {
  invariant(name, '$name is required');
  invariant(typeof name === 'string', '$name must be a string');

  d(f`Loading transform ${name}`);
  const fullPath = path.resolve(name);
  d(f`${name} appears to resolve to ${fullPath}`);
  d(f`Loading ${fullPath} using require()`);
  // There will come a time when this function need to do async things, so,
  // better to force it to be async now.
  const tx = await Promise.resolve(require(fullPath));
  d(f`Loaded ${fullPath} using require()`);
  return tx;
}
