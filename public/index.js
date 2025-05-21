import App from "./app.js";

/* dark theme */
document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.querySelector("#modeToggle");
  const modeIcon = document.querySelector("#modeIcon");

  // setting the mode light/dark
  const setMode = (mode) => {
    document.body.className = mode;
    if (mode === "light-mode") {
      modeIcon.src = "/icons/lightmodeicon.png";
    } else {
      modeIcon.src = "/icons/darkmodeicon.png";
    }
    localStorage.setItem("mode", mode); // using HTML5 local storage to remember the user's selection
  };

  // toggling the mode
  const toggleMode = () => {
    const currentMode = document.body.className;
    let newMode;
    if (currentMode === "light-mode") {
      newMode = "dark-mode";
    } else {
      newMode = "light-mode";
    }
    setMode(newMode); // applying new mode
  };

  modeToggle.addEventListener("click", toggleMode); // when we click the button the toggleMode function is called

  // initial mode based on system preference or saved preference
  const savedMode = localStorage.getItem("mode"); // using HTML5 local storage to remember the user's selection
  let systemPreference;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    systemPreference = "dark-mode";
  } else {
    systemPreference = "light-mode";
  }

  if (savedMode) {
    setMode(savedMode);
  } else {
    setMode(systemPreference);
  }

  // if system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    let newMode;
    if (event.matches) {
      newMode = "dark-mode";
    } else {
      newMode = "light-mode";
    }
    setMode(newMode);
  });


  // a callback function for later
  const adjustCardColors = () => {
    document.querySelectorAll(".card").forEach((card) => {
      const backgrColor = getComputedStyle(card).backgroundColor;
      const rgb = backgrColor.match(/\d+/g); // extracting rgb vals from backgrColor, match all occurrences (/g) of one or more of any digit (\d+)

      const red = parseInt(rgb[0]);
      const green = parseInt(rgb[1]);
      const blue = parseInt(rgb[2]);

      const redBrightness = red * 299;
      const greenBrightness = green * 587;
      const blueBrightness = blue * 114;
      const totalBrightness = redBrightness + greenBrightness + blueBrightness;
      const brightness = Math.round(totalBrightness / 1000); // calcualting rgb brightness

      if (brightness > 125) {
        card.style.color = "#000000";
        card.classList.remove("dark"); // removing dark class accordingly
      } else {
        card.style.color = "#ffffff";
        card.classList.add("dark"); // adding dark class accordingly
      }
    });
  };

  // watch for changes in the DOM
  const observer = new MutationObserver(adjustCardColors);
  observer.observe(document.querySelector("#board"), {
    childList: true,
    subtree: true
  });
  adjustCardColors();

  // added this to adjust text color while typing and not just when typing is done:
  document.querySelector("#board").addEventListener("input", (event) => {
    if (event.target.classList.contains("editDescription")) {
      const card = event.target.closest(".card");
      const backgrColor = getComputedStyle(card).backgroundColor;
      const rgb = backgrColor.match(/\d+/g);
      const red = parseInt(rgb[0]);
      const green = parseInt(rgb[1]);
      const blue = parseInt(rgb[2]);

      const redBrightness = red * 299;
      const greenBrightness = green * 587;
      const blueBrightness = blue * 114;
      const totalBrightness = redBrightness + greenBrightness + blueBrightness;
      const brightness = Math.round(totalBrightness / 1000); // calcualting rgb brightness
      if (brightness > 125) {
        event.target.style.color = "#000000";
      } else {
        event.target.style.color = "#ffffff";
      }
    }
  });
});

const main = () => {
  let app = new App();
  app.loadingBoard();
  window.addEventListener("beforeunload", () => {
    app.savingBoard();
  });
};
main();
