/**
 * @typedef {Object} Package
 * @description The Obejct defined by a package.json
 */

/**
 * @callback transformCallback
 * @param {Package} pkg
 * @returns {Package|Promise<Package>}
 */

/**
 * Asynchronously the specified transform to the specified package.
 * @param {transformCallback} tx
 * @param {Package} pkg
 * @returns {Promise<Package>}
 */
module.exports = async function apply(tx, pkg) {
  const result = await new Promise((resolve) => resolve(tx(pkg)));
  if (!result) {
    throw new Error('tx did not produce a result; did you forget to return your result?');
  }
  return result;
};
