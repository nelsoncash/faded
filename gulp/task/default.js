"use strict";
/* ========================================================================== *
 * default.js
 *
 * @summary Default Gulp Task
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */

/* Imports ------------------------------------------------------------------ */
var gulp = require("gulp");


/* -------------------------------------------------------------------------- */
gulp.task("default", ["browserify"], function(cb){
  //if (!GLOBAL.isProduction) {
    //gulp.start("watch");
  //}
  cb();
});
