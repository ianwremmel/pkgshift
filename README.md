# @ianwremmel/pkgshift

[![license](https://img.shields.io/github/license/ianwremmel/pkgshift.svg)](https://github.com/ianwremmel/pkgshift/blob/master/LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![dependencies Status](https://david-dm.org/ianwremmel/pkgshift/status.svg)](https://david-dm.org/ianwremmel/pkgshift)
[![devDependencies Status](https://david-dm.org/ianwremmel/pkgshift/dev-status.svg)](https://david-dm.org/ianwremmel/pkgshift?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CircleCI](https://circleci.com/gh/ianwremmel/pkgshift.svg?style=svg)](https://circleci.com/gh/ianwremmel/pkgshift)
[![Coverage Status](https://coveralls.io/repos/github/ianwremmel/pkgshift/badge.svg?branch=master)](https://coveralls.io/github/ianwremmel/pkgshift?branch=master)

> Inspired by jscodeshift to help keep package.json consistent

## Install

```js
npm install @ianwremmel/pkgshift
```

or

```js
npm install -g @ianwremmel/pkgshift
```

## Usage

For the most up to date docs, run `pkgshift --help`.

### run

`pkgshift run ./package.json -t ./tranform.js

`pkgshift`'s only command, `run`, applies a transform file to a package.json.

A transform file is of the form

```js
module.exports = function transform(pkg, {api}) {
    return Object.assign(pkg);
};
```

where `transform` implements the [transformCallback](transformcallback)  and `api` is a reference to the [TransformAPI](transformapi).

## API

## Maintainers

[Ian Remmel](https://github.com/ianwremmel)

## Contribute

See [CONTRIBUTE](CONTRIBUTE.md)

## License

&copy; [MIT](LICENSE)
