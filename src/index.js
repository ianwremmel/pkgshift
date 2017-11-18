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

module.exports = apply;
