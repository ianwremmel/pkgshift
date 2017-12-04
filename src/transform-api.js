const {d, f} = require('./lib/debug')(__filename);

/**
 * Sets a script, or, if that script already exists, transforms it into the new
 * script
 * @access public
 * @memberof TransformAPI
 * @param {Package} pkg
 * @param {Object} options
 * @param {string|RegExp} options.from - The original script definition. Must be
 * an exact match, but if a RegExp is supplied, the substring matches will be
 * available to `to`
 * @param {string} options.name - The name in pkg.scripts
 * @param {string} options.to - The final script definition. If `from` is a
 * RegExp, `to` may include substring references.
 */
function setOrReplaceScript(pkg, {
  from, name, to
}) {
  const script = pkg.scripts[name];
  if (!script) {
    d(f`no previous script; settting ${name} to ${to}`);
    pkg.scripts[name] = to;
    return;
  }
  else if (!from) {
    throw new Error(`Refusing to replace existing script "${script}" without a "from" matcher. If you don't care about the script you're replace, please use a match-all regex`);
  }

  if (typeof from === 'string') {
    d(f`"${from}" is a string, checking for exact match`);
    if (from !== script) {
      console.warn(`Unexpected initial value for npm script "${name}. Please update it manually to`);
      console.warn('the following:');
      console.warn();
      console.warn(`  ${to}`);
      console.warn();
      throw new Error(`Initial script "${script}" does not match \`from\` expectation "${from}"`);
    }

    pkg.scripts[name] = to;
    return;
  }

  d(f`assuming "${from}" is a RegExp, checking for match`);
  if (!from.test(script)) {
    console.warn(`Unexpected initial value for npm script "${name}. Please update it manually to`);
    console.warn('the following:');
    console.warn();
    console.warn(`  ${to}`);
    console.warn();
    throw new Error(`Initial script "${script}" does not match \`from\` expectation "${from}"`);
  }

  pkg.scripts[name] = script.replace(from, to);
}

exports.setOrReplaceScript = setOrReplaceScript;
