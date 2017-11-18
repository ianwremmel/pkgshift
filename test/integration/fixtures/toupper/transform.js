module.exports = function tx(pkg) {
  pkg.name = pkg.name.toUpperCase();
  return pkg;
}
