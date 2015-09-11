"use strict";
/*!*****************************************************************************
 * nelsoncash/fog
 *
 * @typedef {String|HTMLElement} container - Reference for plugin application
 *
 * @typedef {Number} midrange - Center percentage which remains style(s) max
 *
 * @typedef {Object.Number} Offset - Adjust (top/bottom) min influence
 * @property {Number} top - <Offset> top (min/max) influence
 * @property {Number} bottom - <Offset> bottom (min/max) influence
 *
 * @typedef {Object.(String|Number)} Style - Assign css style property to affect
 * @property {String|Number} [min] - List edge styling
 * @property {String|Number} [max] - List middle range styling
 *
 *
 * @copyright 2015 Nelson Cash
 * @URL https://github.com/nelsoncash/fog
 ******************************************************************************/

var ArgsHandler = require("./lib/ArgsHandler.js");
var raf = require("raf");


// FIXME: Percentages are not correctly rendered. Check calc values.

function Fog(element, opts){

  // Variable ==================================================================

  var _element = element;
  var _opts = opts;
  var _rafFogHandle = 0;
  var _isRunning = false;


  // Function: Private =========================================================

  // Event Handler -------------------------------------------------------------

  function _rafFog(){
    _rafFogHandle = raf(_render);
    return _rafFogHandle;
  }

  function _onScrollHandler(){
    if (!_isRunning) {
      _rafFog();
    }
    return true;
  }

  // Calculate -----------------------------------------------------------------

  function _calcRangeRelPos(pos, min, max){
    return (pos - min)/(max - min);
  }


  function _calcColorMix(start, end, percent){
    if (percent >= 1.0) {
      return start;
    } else if (percent <= 0) {
      return end;
    } else {
      var clone = start.clone();
      return clone.mix(end, percent);
    }
  }


  /**
   * _calcPortionScrollStyleMin
   *
   * @param {Number} scrollPosition - Child relative position in list
   * @param {Number} min - Minimum percent of style influence on list
   * @param {Number} max - Maximum percent of style influence on list
   * @param {Boolean} isListBottom - Is calculation for list bottom
   * @return {Number} - Percent of style minimum influence
   */
  function _calcScrollStyleMin(scrollPosition, min, max, isListTop){
    var result = (max * scrollPosition);
    result = isListTop ? (max - result) : result;
    return (result < min) ? min : result;
  }


  function _render(){
    _isRunning = true;  // START
    var allChild = [].slice.call(_element.children);
    var allStyle = _opts.style;
    var listRange = _opts.range;
    var allChildStyle = [];
    var allStyleMin = {};

    // All Dimension
    var elementHeight = _element.clientHeight;
    var scrollHeight = _element.scrollHeight;

    // Scroll Position Range
    var scrollTop = _element.scrollTop;
    var scrollBottom = scrollTop + elementHeight;
    scrollBottom = (scrollBottom > scrollHeight ? scrollHeight : scrollBottom);

    // First Child
    var firstChild = allChild[0];
    var firstChildTop = firstChild.offsetTop;
    var firstChildBottom = firstChildTop + firstChild.clientHeight;

    // Last Child
    var lastChild = allChild[allChild.length - 1];
    var lastChildTop = lastChild.offsetTop;
    var lastChildBottom = lastChildTop + lastChild.clientHeight;

    // List Center Range
    var edgeRange = (1 - listRange) / 2;
    var edgeRangeHeight = edgeRange * elementHeight;
    var edgeRangeTop = scrollTop + edgeRangeHeight;
    var edgeRangeBottom = scrollBottom - edgeRangeHeight;


    function calcListTopEdgeStyleMin(min, max){
      if (scrollTop < firstChildTop) {
        return max;

      } else if (scrollTop < firstChildBottom) {
        return _calcScrollStyleMin(
          _calcRangeRelPos(scrollTop, firstChildTop, firstChildBottom),
          min,
          max,
          true
        );

      } else {
        return min;
      }
    }


    function calcListBottomEdgeStyleMin(min, max){
      if (scrollBottom > lastChildBottom) {
        return max;
        
      } else if (scrollBottom > lastChildTop) {
        return _calcScrollStyleMin(
          _calcRangeRelPos(scrollBottom, lastChildTop, lastChildBottom),
          min,
          max,
          false
        );
 
      } else {
        return min;
      }
    }


    function calcChildStyleMin(style, min, max){
      var result = {};
      result.top = calcListTopEdgeStyleMin(min, max);
      result.bottom = calcListBottomEdgeStyleMin(min, max);
      return result;
    }
    

    // Calculate Layout
    allChild.forEach(function(child, index){
      var childTop = child.offsetTop;
      var childBottom = childTop + child.offsetHeight;
      allChildStyle[index] = allChildStyle[index] || {};
      for (var style in allStyle) {
        if (!allStyle.hasOwnProperty(style)) {
          continue;
        }
        var styleMin = allStyle[style].isColor ? 0 : allStyle[style].min;
        var styleMax = allStyle[style].isColor ? 1.0 : allStyle[style].max;
        var childStyleValue = styleMin;

        // Find Scroll Edges
        if (!allStyleMin[style]) {
          allStyleMin[style] = calcChildStyleMin(style, styleMin, styleMax);
        }

        // Only calculate viewable children
        if ((childBottom >= scrollTop) && (childTop <= scrollBottom)) {
          if (childTop < edgeRangeTop) {
            childStyleValue = styleMax * _calcRangeRelPos(childTop, scrollTop, edgeRangeTop);
            childStyleValue = childStyleValue < allStyleMin[style].top ? allStyleMin[style].top : childStyleValue;

          } else if (childBottom > edgeRangeBottom) {
            childStyleValue = styleMax - (styleMax * _calcRangeRelPos(childBottom, edgeRangeBottom, scrollBottom));
            childStyleValue = childStyleValue < allStyleMin[style].bottom ? allStyleMin[style].bottom : childStyleValue;

          } else {
            childStyleValue = styleMax;
          }
        }

        if (allStyle[style].isColor) {
          childStyleValue = _calcColorMix(
            allStyle[style].max,
            allStyle[style].min,
            childStyleValue
          ).rgbaString();
        }
        allChildStyle[index][style] = childStyleValue;
      }
    });

    // Render Layout
    allChild.forEach(function(child, index){
      var childStyle = allChildStyle[index];
      for (var style in childStyle) {
        if (childStyle.hasOwnProperty(style)) {
          child.style[style] = childStyle[style];
        }
      }
    });

    _isRunning = false; // END
  }


  function _clearOpts(){
    var allChild = [].slice.call(_element.children);
    allChild.forEach(function(child){
      child.removeAttribute("style");
    });
  }

  // Function: Public ==========================================================

  this.remove = function remove(){
    var isSuccess = false;
    if (_onScrollHandler) {
     _element.removeEventListener("scroll", _onScrollHandler);
     isSuccess = true;
    }
    if (_isRunning && _rafFogHandle) {
      raf.cancel(_rafFogHandle);
      _rafFogHandle = 0;
      isSuccess = true;
    }
    return isSuccess;
  };


  // setOpts onScroll is a NOOP because performance.
  // TODO: test with es6 promise
  this.setOpts = function setOpts(allOption){
    var isSuccess = false;
    //if (!_isRunning) {
      _clearOpts();
      _opts = ArgsHandler.resolveAllOption(allOption);
      _rafFog();
      isSuccess = true;
    //}
    return isSuccess;
  };


  // Initialize  ----------------------------------------------------------------------

  function _init(){
    _element.addEventListener("scroll", _onScrollHandler);
    _onScrollHandler();
  }
  _init();

}


module.exports = function(element, opts){
  element = ArgsHandler.resolveList(element);
  opts = ArgsHandler.resolveAllOption(opts);
  return new Fog(element, opts);
};

