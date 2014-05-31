# Purple Robot Client

A library that simplifies command passing to [Purple Robot](https://github.com/cbitstech/Purple-Robot-Manager)
via its HTTP server and JavaScript API. Scripts are generated as strings and
sent as JSON, then deserialized and interpreted by Purple Robot.

[Documented source code with examples](http://cbitstech.github.io/PurpleRobotClient/docs/purple-robot.html)

## Installing

`bower install git@github.com:cbitstech/PurpleRobotClient.git#1.5.2.5`

## Updating the documentation

Install [docco](http://jashkenas.github.io/docco/): `sudo npm install -g docco`

Run docco: `docco purple-robot.js`

## Running specs

### Install dependencies

    bower install

### In a browser

open `spec/SpecRunner.html`

### Headless

1. Install [PhantomJS](http://phantomjs.org/download.html)
2. Run `phantomjs spec/run-jasmine.js spec/SpecRunner.html` or `./run_specs`
