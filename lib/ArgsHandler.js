"use strict";
/* =========================================================================== *
 * ArgsHandler.js
 *
 * @typedef {String|HTMLElement} element - HTMLElement with Scrollable Items
 *
 * @typedef {Number} range - Center percentage which remains style(s) max
 *
 * @typedef {Object} AllStyle - Collection of <Style> which modify element Children
 *
 * @typedef {Object} Style
 * @property {String|Number} [min] - List edge styling
 * @property {String|Number} [max] - List middle range styling
 *
 * @TODO: Add <Offset> to <Opts>
 * @typedef {Object} Offset - Adjust (top/bottom) min influence
 * @property {Number} top - <Offset> top (min/max) influence
 * @property {Number} bottom - <Offset> bottom (min/max) influence
 *
 * @copyright 2015 Nelson Cash
 * ========================================================================== */

var isElement = require("lodash/lang/isElement");
var isPlainObject = require("lodash/lang/isPlainObject");
var isString = require("lodash/lang/isString");
var isNumber = require("lodash/lang/isNumber");
var Color = require("color");

var config = require("./config.js");
var eLog = require("./util/Log.js").error;


// PRIVATE =====================================================================

// Create ----------------------------------------------------------------------

function _createDefaultStyle(){
  var style = {};
  var prop = config.default.style;
  var min = config.default.min;
  var max = config.default.max;
  style[prop] = {
    isColor: false,
    min: min,
    max: max
  };
  return style;
}


// Retrieve --------------------------------------------------------------------

function _getListElementByString(str){
  var element = document.getElementById(str);
  if (!element) {
    var allElement = Document.getElementsByClassName(str);
    if (allElement.length >= 0) {
      eLog("Argument 'element' MUST reference single unique <HTMLElement>.");
    }
    element = allElement[0];
  }
  return element;
}


// Validate --------------------------------------------------------------------

function _isPropertySupported(property){
  return property in document.body.style;
}


// Resolve ---------------------------------------------------------------------

function _resolveColor(str) {
  var color;
  try {
    color = new Color(str);
  } catch (e) {
    eLog("Invalid Color " + str);
  }
  return color;
}


function _resolveStyle(property, obj){
  var style = {};
  if (property.indexOf("color") >= 0) {
    if (!(obj.min || obj.max)) {
      // '<property>' MUST have one CSS valid color specified. (min,max).
      eLog("One <String> (min/max) color is REQUIRED for '" + property + "'");
    }
    style.min = _resolveColor(obj.min || config.default.color);
    style.max = _resolveColor(obj.max || config.default.color);
    style.isColor = true;
  } else {
    style.min = (obj.min && isNumber(obj.min) ? obj.min : config.default.min);
    style.max = (obj.max && isNumber(obj.max) ? obj.max : config.default.max);
    style.isColor = false;
  }
  return style;
}


function _resolveAllStyle(allStyle){
  var result = {};
  for (var prop in allStyle) {
    if (allStyle.hasOwnProperty(prop)) {
      prop = prop.toLowerCase();
      if (!_isPropertySupported(prop)) {
        eLog("'" + prop + "' is not supported. Check README.");
      }
      result[prop] = _resolveStyle(prop, allStyle[prop]);
    }
  }
  return result;
}


// PUBLIC ======================================================================

// Resolve ---------------------------------------------------------------------

exports.resolveList = function resolveList(arg){
  if (arg && isElement(arg)) {
    return arg;
  } else if (arg && isString(arg)) {
    return _getListElementByString(arg);
  } else {
    eLog("Argument 'element' typeof <HTMLElement> or <String> REQUIRED!");
  }
};


exports.resolveAllOption = function resolveAllOption(opts){
  opts = opts && isPlainObject(opts) ? opts : {};
  if (isPlainObject(opts.style) && Object.keys(opts.style).length > 0) {
    // resolve opts
    opts.style = _resolveAllStyle(opts.style);
  } else {
    opts.style = _createDefaultStyle();
  }
  var range = opts.range;
  opts.range = (range && isNumber(range) && range <= 1 ? range : config.default.range);
  return opts;
};


// Validation ------------------------------------------------------------------

