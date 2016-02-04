"use strict";
/* ========================================================================== *
 * config.js
 *
 * @summary Gulp Build Configuration
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */

module.exports = {
  src: ["./index.js"],
  dest: "./dist",
  test: "./spec/**/*[sS]pec.js",
  fileName: "faded.js",
  appName: "Faded",
  browserify: {
    paths: []
  },
  jasmine: {
    verbose: true,
    includeStackTrace: true,
    timeout: 5000
  }
};
