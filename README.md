# Purple Robot Client

A library that simplifies command passing to [Purple Robot](https://github.com/cbitstech/Purple-Robot-Manager)
via its HTTP server and JavaScript API. Scripts are generated as strings and
sent as JSON, then deserialized and interpreted by Purple Robot.

[Documented source code with examples](http://cbitstech.github.io/PurpleRobotClient/docs/purple-robot.html)

## Installing

`bower install git@github.com:cbitstech/PurpleRobotClient.git#<tagged version>`

Where tagged version is the specific version to be installed.

## Updating the documentation

1. Install [docco](http://jashkenas.github.io/docco/): `sudo npm install -g docco`
2. Run docco: `docco purple-robot.js`

## Creating minified version

1. Download [Google Closure Compiler](http://dl.google.com/closure-compiler/compiler-latest.zip)
2. Unzip
3. Run `java -jar <compiler dir>/compiler.jar --js purple-robot.js --js_output_file purple-robot.min.js --create_source_map ./purple-robot.min.js.map --source_map_format=V3`

## Running specs

### Install dependencies

    npm install

### Headless

    grunt jasmine

### With linting

    grunt

## Release

1. update version number
2. update docs
3. minify
4. run specs
5. update CHANGELOG.md
6. commit
7. tag
8. merge master into gh-pages branch
9. push all branches and tags
