const chalk = require('chalk');
const debug = require('debug');
const invariant = require('invariant');
const supportsColor = require('supports-color');

const pkg = require('../../package');

module.exports = d;

/**
 * Wrapper around debug to ensure consistency across the project
 * @example
 * const {d, f} = require('./debug')(__filename)
 * d('a plain string');
 * d(f`a string with ${1} variable`);
 * @param {string} filename
 * @private
 * @returns {Function}
 */
function d(filename) {
  invariant(filename, '$filename is required');
  invariant(typeof filename === 'string', '$filename must be a string');

  const rootName = pkg.name.includes('/') ? pkg.name.split('/')
    .pop() : pkg.name;

  const res = debug(filename
    .substr(filename.indexOf(rootName))
    .replace('src/', '')
    .replace(/\/|\\/g, ':')
    .replace(/.js$/, ''));

  return {
    d: res,
    f
  };
}

/**
 * Formatter for template strings.
 * @param {Array<string>} tpl
 * @param {Array<mixed>} params
 * @private
 * @returns {string}
 */
function f(tpl, ...params) {

  let res = '';
  for (let i = 0; i < tpl.length; i++) {
    res += tpl[i];
    // If we've reached that last position, don't print params[i] (params will
    // always have one less entry than tpl)
    if (params.length !== i) {
      res += v(params[i]);
    }
  }
  return res;
}

exports.f = f;

/**
 * Colorizes variables for template string
 * @param {mixed} value
 * @private
 * @returns {string}
 */
function v(value) {
  if (!supportsColor.stdout) {
    return `"${value}"`;
  }

  switch (typeof value) {
    case 'boolean':
      return value ? chalk.green(value) : chalk.red(value);
    case 'number':
      return chalk.yellow(value);
    case 'string':
      if (value.includes('/')) {
        return chalk.green(value);
      }
      return chalk.blue(value);
    default:
      return chalk.grey(value);
  }
}
