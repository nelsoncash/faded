"use strict";
/* ========================================================================== *
 * browserify.js
 *
 * @summary Browserify Gulp Task
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */

var gulp = require("gulp");
var gUtil = require("gulp-util");
var gSize = require("gulp-size");
var gRename = require("gulp-rename");
var gNotify = require("gulp-notify");
var gUglify = require("gulp-uglify");
var gDerequire = require("browserify-derequire");

var browserify = require("browserify");
var watchify = require("watchify");
var collapse = require("bundle-collapser/plugin");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

var config = require("../config.js");

gulp.task("browserify",function(){
  var b = browserify({
    entries: config.src,
    //debug: !GLOBAL.isProduction,
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: false,
    standalone: config.appName,
    paths: config.browserify.paths
  });

  function bundle(){
    // BUILD JS
    return b.bundle()
      .on("error", gNotify.onError({
        title:"Browserify Compile Error",
        message:"<%= error.message %>\n<%= error.stack %>",
      }))
      .pipe(source(config.fileName))  // Set file name
      .pipe(buffer())
      .pipe(gSize({title: "JS:base"}))
      .pipe(gulp.dest(config.dest))
      .pipe(GLOBAL.isProduction ? gUglify() : gUtil.noop())
      .pipe(GLOBAL.isProduction ? gRename({ extname: ".min.js" }) : gUtil.noop())
      .pipe(GLOBAL.isProduction ? gSize({title: "JS:min"}) : gUtil.noop())
      .pipe(GLOBAL.isProduction ? gulp.dest(config.dest) : gUtil.noop());
  }

  // Continious Watch/Build
  if (!GLOBAL.isProduction) {
    b = watchify(b);
    b.on("update", function(){
      bundle();
      //gulp.run("jasmine");
    });
  } else {
    b.plugin(collapse);
    b.plugin(gDerequire);
  }
  // Build Bundle
  return bundle();
});
