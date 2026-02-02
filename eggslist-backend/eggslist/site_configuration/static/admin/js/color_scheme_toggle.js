(function () {
  "use strict";

  function toggleCustomColors() {
    var scheme = document.getElementById("id_color_scheme");
    if (!scheme) return;

    var customFieldset = null;
    var fieldsets = document.querySelectorAll("fieldset");
    fieldsets.forEach(function (fs) {
      var legend = fs.querySelector("h2");
      if (legend && legend.textContent.trim() === "Custom Colors") {
        customFieldset = fs;
      }
    });
    if (!customFieldset) return;

    if (scheme.value === "custom") {
      customFieldset.classList.remove("collapsed");
    } else {
      customFieldset.classList.add("collapsed");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    toggleCustomColors();
    var scheme = document.getElementById("id_color_scheme");
    if (scheme) {
      scheme.addEventListener("change", toggleCustomColors);
    }
  });
})();
