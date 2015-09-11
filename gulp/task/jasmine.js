"use strict";
/* ========================================================================== *
 * jasmine.js
 *
 * @summary Jasmine Gulp Task
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */

var gulp = require("gulp");
var gJasmine = require("gulp-jasmine");
var config = require("../config.js");


gulp.task("jasmine", ["browserify"], function(){
  return gulp.src(config.test)
    .pipe(gJasmine(config.jasmine));
});

