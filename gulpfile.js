"use strict";
/* ========================================================================== *
 * Gulpfile
 *
 * @example
 * // Development: Make Magical Things && Watch
 * $ gulp
 *
 * // Production: Clean Up && Compress
 * $ gulp -p
 *
 * @copyright Nelson Cash, 2015
 * All rights reserved.
 *
 * ========================================================================== */


/* Imports ------------------------------------------------------------------ */
var gUtil = require("gulp-util");


/* Settings ----------------------------------------------------------------- */
GLOBAL.isProduction = gUtil.env.p || false; 


/* Execute ------------------------------------------------------------------ */
require("./gulp");
