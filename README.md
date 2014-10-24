# Purple Robot Client

[![Build Status](https://travis-ci.org/cbitstech/PurpleRobotClient.svg?branch=master)](https://travis-ci.org/cbitstech/PurpleRobotClient)

A library that simplifies command passing to [Purple Robot](https://github.com/cbitstech/Purple-Robot-Manager)
via its HTTP server and JavaScript API. Scripts are generated as strings and
sent as JSON, then deserialized and interpreted by Purple Robot.

[Documented source code with examples](http://cbitstech.github.io/PurpleRobotClient/docs/purple-robot.html)

## Installing

`bower install git@github.com:cbitstech/PurpleRobotClient.git#<tagged version>`

Where tagged version is the specific version to be installed.

## Developing

The first thing to do is install the development dependencies with `npm install`.

### Updating the documentation

    grunt document

### Creating minified version

    grunt minify

### Running specs

Note that tests are run against the minified version.

    grunt test

## Releasing

1. update version number
2. `grunt`
3. update CHANGELOG.md
4. commit
5. tag
6. merge master into gh-pages branch
7. push all branches and tags
