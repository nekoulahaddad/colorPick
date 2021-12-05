"use strict";

(function () {
  function ID() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  const intialData = [
    { id: ID(), name: "name1", type: "main", color: "#f4f4f4" },
    { id: ID(), name: "name2", type: "main", color: "#f4f4f4" },
    { id: ID(), name: "name3", type: "side", color: "#f8f8f8" },
  ];
  let colorsData =
    window.localStorage.getItem("colors") &&
    JSON.parse(window.localStorage.getItem("colors"));
  !colorsData
    ? window.localStorage.setItem("colors", JSON.stringify(intialData))
    : null;
})();
