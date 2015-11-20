"use strict";
/*!*****************************************************************************
 * Helper.js
 *
 * @copyright 2015 Nelson Cash
 * @URL https://github.com/nelsoncash/fog
 ******************************************************************************/

var eLog = require("./Log");

/**
 * arrayDifference
 *
 * @param {Array} first
 * @param {Array} second
 * @return {Array} <Array> with difference between arguments
 */
exports.arrayDifference = function arrayDifference(first, second){
  if (!Boolean(Array.isArray(first) && Array.isArray(second))) {
    eLog("(Helper.arrayExclusiveIntersect): two array arguments required.")
  }
  return first.filter(function(itemFirst){
    return !second.some(function(itemSecond){
      return Boolean(itemFirst === itemSecond);
    });
  });
};
