"use strict";
/* =========================================================================== *
 * util/LogSpec.js
 * ========================================================================== */

describe("Log", function(){

  var Log = require("../../lib/util/Log.js");
  var config = require("../../lib/config.js");

  describe("error", function(){
    it("should throw an <Error> with message", function(){
      var raw = "Typical Message";
      var message = config.title + ": " + raw;
      expect(function(){
        Log.error(raw);
      }).toThrowError(Error, message);
    });
  });


});
