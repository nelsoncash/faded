"use strict";
/*!*****************************************************************************
 * Log.js
 *
 * @copyright 2015 Nelson Cash
 * https://github.com/nelsoncash/fog
 ******************************************************************************/

var config = require("../config.js");

exports.error = function error(){
  var header = config.title + ":";
  var args = Array.prototype.slice.call(arguments);
  args.unshift(header);
  //console.error.apply(console, args);
  var message = args.join(" ");
  throw new Error(message, config.file);
};
