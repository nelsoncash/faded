"use strict";
/* ========================================================================== *
 * watch.js
 *
 * @summary Watch Gulp Task
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */

var gulp = require("gulp");
var config = require("../config.js");
var gWatch = require("gulp-watch");



gulp.task("watch", ["browserify"], function(cb){
  gWatch(config.test, {name: "Jasmine"}, function(){
    gulp.start("jasmine");
  });

  cb();
});

