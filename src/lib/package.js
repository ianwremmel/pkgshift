const invariant = require('invariant');
const {readFile, writeFile} = require('mz/fs');

const {d, f} = require('./debug')(__filename);

/**
 * Reads a package.json into a {@link Package}
 * @param {string} file - Path to a package.json
 * @returns {Promise<Package>}
 */
async function read(file) {
  invariant(file, '$file is required');
  invariant(typeof file === 'string', '$file must be a string');

  d(f`reading package at ${file}`);
  const raw = String(await readFile(file));
  d(f`loaded ${file} into memory`);
  d(f`JSON parsing ${file}`);
  const pkg = JSON.parse(raw);
  d(f`JSON parsed ${file}`);
  d(f`read package at ${file}`);
  return pkg;
}

exports.read = read;

/**
 * Writes a {@link Package} back to a package.json
 * @param {string} file - Path to a package.json
 * @param {Package} pkg - The {@link Package} to write
 */
async function write(file, pkg) {
  invariant(file, '$file is required');
  invariant(typeof file === 'string', '$file must be a string');
  invariant(pkg, '$pkg is required');
  invariant(typeof pkg === 'object', '$pkg must be an Object');

  d(f`writing package to ${file}`);
  await writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`);
  d(f`wrote package to ${file}`);
}

exports.write = write;
