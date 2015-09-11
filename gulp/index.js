"use strict";
/* ========================================================================== *
 * index.js
 *
 * @summary Search task directory & import all task
 * @description Rather than manage one giant configuration file responsible
 * for creating multiple tasks, each task has been broken out into
 * its own file in gulp/task. Any file in that folder gets automatically
 * required by the loop.
 *
 * To add a new task, simply add a new task file to gulp/task.
 * ========================================================================== */

var fs = require("fs");
var path = require("path");
var allTaskDirectoryPath = path.join(__dirname, "task");
var allTask = fs.readdirSync(allTaskDirectoryPath);

allTask.forEach(function(task) {
  require("./task/" + task);
});

