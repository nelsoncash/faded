"use strict";
/* =========================================================================== *
 * @module ArgsHandler
 *
 * @typedef {Object} AllOption
 * @property {Range}
 * @property {AllStyle}
 *
 * @typedef {Number} Range - Center percentage which remains style(s) max
 *
 * @typedef {Object.<Style>} AllStyle - Collection of <Style> which modify element Children
 *
 * @typedef {Object} Style
 * @property {?(String|Number)} [min] - List edge styling
 * @property {?(String|Number)} [max] - List middle range styling
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

/**
 * _createDefaultStyle
 *
 * @return {!Style} - Default Style Configuration
 */
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

/**
 * _createCSSQueryString
 *
 * @param {String} str - Value to Prepare
 * @return {String} getElementByClassName friendly value
 */
function _createCSSQueryString(str){
  return str.split(".").join(" ").trim();
}

// Retrieve --------------------------------------------------------------------

/**
 * _getListElementByString
 *
 * @param {String} str - Element CSS class(s) or HTMLElement id
 * @return {?HTMLElement} First HTMLElement matching criteria
 */
function _getListElementByString(str){
  var identifier = str[0];
  var element = null;
  if (identifier === "#") {
    var queryString = str.slice(1);
    element = document.getElementById(queryString);
  } else if (identifier === ".") {
    var queryString = _createCSSQueryString(str);
    var allElement = Document.getElementsByClassName(queryString);
    if (allElement.length >= 0) {
      eLog("Argument 'element' MUST reference single unique <HTMLElement>.");
    }
    element = allElement[0];
  } else {
    eLog("Argument 'element' MUST reference single unique <HTMLElement>.");
  }
  return element;
}


// Validate --------------------------------------------------------------------

/**
 * _hasPropertySupported
 *
 * @param {String} prop - CSS property to query
 * @return {Boolean} Property Support Status
 */
function _hasPropertySupported(prop){
  return prop in document.body.style;
}


// Resolve ---------------------------------------------------------------------

/**
 * _resolveColor
 *
 * @param {String} str - Color to Construct
 * @return {Color} Color Object
 */
function _resolveColor(str){
  var color;
  try {
    color = new Color(str);
  } catch (e) {
    eLog("Invalid Color " + str);
  }
  return color;
}


/**
 * _resolveStyle
 *
 * @param {String} prop - CSS property to modify
 * @param {Object} obj - Configuration for specifed CSS Property
 * @return {Style} Resolved <Style>
 */
function _resolveStyle(prop, obj){
  var style = {};
  if (prop.indexOf("color") >= 0) {
    if (!(obj.min || obj.max)) {
      eLog("One <String> (min/max) color is REQUIRED for '" + prop + "'");
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


/**
 * _resolveAllStyle
 *
 * @param {!AllStyle} allStyle - <AllStyle> with resolved <Style>(s)
 * @return {AllStyle} Resolved <AllStyle>
 */
function _resolveAllStyle(allStyle){
  var result = {};
  for (var prop in allStyle) {
    if (allStyle.hasOwnProperty(prop)) {
      prop = prop.toLowerCase();
      if (!_hasPropertySupported(prop)) {
        eLog("'" + prop + "' is not supported. Check README.");
      }
      result[prop] = _resolveStyle(prop, allStyle[prop]);
    }
  }
  return result;
}


// PUBLIC ======================================================================

// Resolve ---------------------------------------------------------------------

/**
 * resolveList
 *
 * @param {!(String|HTMLElement)} arg - List Element to apply affect
 */
exports.resolveList = function resolveList(arg){
  if (arg && isElement(arg)) {
    return arg;
  } else if (arg && isString(arg)) {
    return _getListElementByString(arg);
  } else {
    eLog("Argument 'element' typeof <HTMLElement> or <String> REQUIRED!");
  }
};


/**
 * resolveAllOption
 *
 * @param {AllOption} opts Plugin Configuration
 * @return {AllOption} Consuption Ready Plugin Configuration
 */
exports.resolveAllOption = function resolveAllOption(opts){
  var allOpt = opts && isPlainObject(opts) ? opts : {};
  if (isPlainObject(allOpt.style) && Object.keys(allOpt.style).length > 0) {
    // resolve opts
    allOpt.style = _resolveAllStyle(allOpt.style);
  } else {
    allOpt.style = _createDefaultStyle();
  }
  var range = allOpt.range;
  allOpt.range = (range && isNumber(range) && range <= 1 ? range : config.default.range);
  return allOpt;
};

