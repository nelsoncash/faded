/* ========================================================================== *
 * Faded Demo - Javascript
 * (C) 2015 Nelson Cash
 * ========================================================================== */

(function () {
  "use strict";
  var container = document.getElementById("example");

  var opacity = document.getElementById("opacity");
  var color = document.getElementById("color");
  var shazam = document.getElementById("shazam");

  var adjective = [
    "fun",
    "smart",
    "cool",
    "small",
    "hot",
    "sharp",
    "clean",
    "content",
    "pleased",
    "cheerful",
    "jovial",
    "jolly",
    "different",
    "thrilled",
    "admiring",
    "enthusing",
    "glad"
  ];


  function populateContainer(count) {
    var adjCount = adjective.length;
    for (var i = 1; i < count; i++) {
      var item = document.createElement("li");
      var randomIndex = Math.floor(Math.random() * adjCount);
      item.innerText = [
        "faded",
        "is",
        adjective[randomIndex]
      ].join(" ");
      container.appendChild(item);
    }
  }

  populateContainer(65);

  var faded = window.Faded(".example.active");

  opacity.addEventListener("click", function(){
    faded.setOpts({
      style: {
        opacity: {
          min: 0.1
        }
      }
    });
  });

  color.addEventListener("click", function(){
    faded.setOpts({
      style: {
        color: {
          min: "rgb(7,17,76)",
          max: "maroon"
        }
      }
    });
  });

  shazam.addEventListener("click", function(){
    faded.setOpts({
      range: 0.2,
      style: {
        color: {
          min: "rgb(7,17,76,0.1)",
          max: "cyan"
        }
      }
    });
  });

}());
