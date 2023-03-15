// @ts-nocheck
import { executeScriptFunc } from "./utils.js";
import { textToSpeech } from "./text-to-speech.js";

let storage = chrome.storage.local;
const storageItems = {
  leftAlignButton: false,
  centerAlignButton: false,
  rightAlignButton: false,
  monochromeModeToggle: false,
  highContrastToggle: false,
  darkContrastToggle: false,
  highSaturationToggle: false,
  lowSaturationToggle: false,
  visuallyImpairedToggle: false,
  epilepsyToggle: false,
  cognitiveDisabilityModeToggle: false,
  adhdFriendlyModeToggle: false,
  magnifyToggle: false,
  colorBlindToggle: false,
  dyslexiaFriendlyToggle: false,
  redTextButton: false,
  greenTextButton: false,
  yellowTextButton: false,
  blackTextButton: false,
  whiteTextButton: false,
  orangeTextButton: false,
  tealTextButton: false,
  blueTextButton: false,
  violetTextButton: false,
  purpleTextButton: false,
  pinkTextButton: false,
  redBackgroundButton: false,
  greenBackgroundButton: false,
  yellowBackgroundButton: false,
  blackBackgroundButton: false,
  whiteBackgroundButton: false,
  orangeBackgroundButton: false,
  tealBackgroundButton: false,
  blueBackgroundButton: false,
  violetBackgroundButton: false,
  purpleBackgroundButton: false,
  pinkBackgroundButton: false,
  redTitleButton: false,
  greenTitleButton: false,
  yellowTitleButton: false,
  blackTitleButton: false,
  whiteTitleButton: false,
  orangeTitleButton: false,
  tealTitleButton: false,
  blueTitleButton: false,
  violetTitleButton: false,
  purpleTitleButton: false,
  pinkTitleButton: false,
  hideImagesToggle: false,
  moveImagesToggle: false,
};

window.onbeforeunload = (/** @type {any} */ _e) => {
  // TODO:

  chrome.runtime.sendMessage({ msg: "page-leave" });
};

window.onload = async (/** @type {any} */ _e) => {
  const toggleFunctions = {
    leftAlignButton: "leftAlignMode",
    centerAlignButton: "centerAlignMode",
    rightAlignButton: "rightAlignMode",
    monochromeModeToggle: "monochromeMode",
    highContrastToggle: "highContrast",
    darkContrastToggle: "darkContrast",
    highSaturationToggle: "highSaturation",
    lowSaturationToggle: "lowSaturation",
    visuallyImpairedToggle: "adjustColors",
    epilepsyToggle: "toggleEpilepsySwitchFunction",
    cognitiveDisabilityModeToggle: "highlightElements",
    adhdFriendlyModeToggle: "toggleAdhdMode",
    magnifyToggle: "toggleTooltip",
    colorBlindToggle: "toggleColorBlindMode",
    dyslexiaFriendlyToggle: "toggleDyslexiaMode",
    hideImagesToggle: "hideImages",
    moveImagesToggle: "toggleMovePictures",
  };
  storage.get(
    storageItems,
    async (/** @type {{ [x: string]: any; }} */ items) => {
      for (let key in items) {
        if (items[key]) {
          await executeScriptFunc(window[toggleFunctions[key]], true);
        }
      }
    }
  );

  // const textColors = {
  //   redTextButton: "red",
  //   greenTextButton: "green",
  //   yellowTextButton: "yellow",
  //   blackTextButton: "black",
  //   whiteTextButton: "white",
  //   orangeTextButton: "orange",
  //   tealTextButton: "teal",
  //   blueTextButton: "blue",
  //   violetTextButton: "violet",
  //   purpleTextButton: "purple",
  //   pinkTextButton: "pink",
  // };
  // storage.get(
  //   storageItems,
  //   async (/** @type {{ [x: string]: any; }} */ items) => {
  //     for (let key in items) {
  //       if (items[key]) {
  //
  //         await executeScriptFunc(setTextColor, true, textColors[key]);
  //       }
  //     }
  //   }
  // );
};

const addPlayButtonOnHighlight = (
  /** @type {Selection | null} */ selection
) => {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.pageXOffset;
  const y = rect.top + window.pageYOffset;
  const button = document.createElement("button");
  button.style.position = "absolute";
  button.className = "speech-text";
  button.style.top = y - 10 + "px";
  button.style.left = x + 10 + "px";
  button.innerHTML =
    "<span class='material-symbols-outlined'>play_circle</span>";
  document.body.appendChild(button);
  button.addEventListener("click", () => {
    // Do something with the highlighted text
    document.querySelectorAll(".speech-text").forEach((el) => el.remove());
    const selectedText = selection.toString();
    if (selectedText) {
      // TODO: apply to document
      // chrome.tabs.query(
      //   { active: true, currentWindow: true },
      //   (/** @type {{ id: any; }[]} */ tabs) => {
      //     chrome.scripting.executeScript({
      //       target: { tabId: tabs[0].id },
      //       func: textToSpeech.startTextToSpeech,
      //       args: [selectedText],
      //     });
      //   }
      // );
      textToSpeech.startTextToSpeech(selectedText);
    }
  });
};
document.addEventListener("DOMContentLoaded", async (_e) => {
  // TODO: use messaging.
  // chrome.runtime.sendMessage({
  //   msg: "initialize_text_to_speech",
  //   data: { textToSpeech: textToSpeech },
  // });
  // let textToSpeachPlay = document.getElementById("play");
  // textToSpeachPlay?.addEventListener("click", async (e) => {
  //   chrome.runtime.sendMessage({
  //     msg: "speak_hello_message",
  //     data: {},
  //   });
  //   document.addEventListener("mouseup", async (e) => {
  //     chrome.runtime.sendMessage({
  //       msg: "add_play_button",
  //       data: {
  //         content: window.getSelection(),
  //       },
  //     });
  //   });
  // });
  let textToSpeachPlay = document.getElementById("blind-friendly-mode-toggle");
  textToSpeech.initialize();
  // await executeScriptFunc(textToSpeech.initialize, "");
  textToSpeachPlay?.addEventListener("change", async (e) => {
    // if (textToSpeech.data.player == null) {

    if (e.target.checked) {
      textToSpeech.startTextToSpeech(
        "Highlight a piece of text and click play to listen."
      );

      document.addEventListener("mouseup", async (e) => {
        const selectedText = window.getSelection().toString();

        if (selectedText) {
          addPlayButtonOnHighlight(window.getSelection());
        }
      });
    } else {
      console.log("Stop current audio");

      textToSpeech.data.isPlaying = false;

      if (textToSpeech.data.player) {
        textToSpeech.data.player.pause();
      }

      textToSpeech.data.player = null;
      document.removeEventListener("mouseup", addPlayButtonOnHighlight);
    }
  });
  // TODO: Refactor to a for loop/map
  document
    .getElementById("font-size-decrease-btn")
    ?.addEventListener("click", decreaseFontSize);
  document
    .getElementById("font-size-increase-btn")
    ?.addEventListener("click", increaseFontSize);
  document
    .getElementById("line-height-decrease-btn")
    ?.addEventListener("click", decreaseLineHeight);
  document
    .getElementById("line-height-increase-btn")
    ?.addEventListener("click", increaseLineHeight);
  document
    .getElementById("letter-spacing-increase-btn")
    ?.addEventListener("click", increaseLetterSpacing);
  document
    .getElementById("letter-spacing-decrease-btn")
    ?.addEventListener("click", decreaseLetterSpacing);
  const highContrastToggle = document.getElementById(
    "high-contrast-mode-toggle"
  );
  const darkContrastToggle = document.getElementById(
    "dark-contrast-mode-toggle"
  );
  const highSaturationToggle = document.getElementById(
    "high-saturation-mode-toggle"
  );
  const lowSaturationToggle = document.getElementById(
    "low-saturation-mode-toggle"
  );
  const monochromeModeToggle = document.getElementById(
    "monochrome-mode-toggle"
  );
  const dyslexiaFriendlyToggle = document.getElementById(
    "dyslexia-friendly-mode-toggle"
  );
  const visuallyImpairedToggle = document.getElementById(
    "visually-impaired-mode-toggle"
  );
  const epilepsyToggle = document.getElementById("epilepsy-toggle");

  const cognitiveDisabilityModeToggle = document.getElementById(
    "cognitive-disability-mode-toggle"
  );

  const adhdFriendlyModeToggle = document.getElementById(
    "adhd-friendly-mode-toggle"
  );

  const boldTextButton = document.getElementById("bold-text");
  const italicTextButton = document.getElementById("italic-text");
  const underlineTextButton = document.getElementById("underline-text");
  const strikethroughTextButton = document.getElementById("strikethrough-text");

  const leftAlignButton = document.getElementById("left-align");
  const centerAlignButton = document.getElementById("center-align");
  const rightAlignButton = document.getElementById("right-align");
  const justifyAlignButton = document.getElementById("justify-align");

  const magnifyToggle = document.getElementById("text-magnifier-mode-toggle");
  const colorBlindToggle = document.getElementById(
    "color-blind-friendly-mode-toggle"
  );
  const hideImagesToggle = document.getElementById("hide-images-mode-toggle");

  const redTextButton = document.getElementById("text-red");
  const greenTextButton = document.getElementById("text-green");
  const yellowTextButton = document.getElementById("text-yellow");
  const blackTextButton = document.getElementById("text-black");
  const whiteTextButton = document.getElementById("text-white");
  const orangeTextButton = document.getElementById("text-orange");
  const tealTextButton = document.getElementById("text-teal");
  const blueTextButton = document.getElementById("text-blue");
  const violetTextButton = document.getElementById("text-violet");
  const purpleTextButton = document.getElementById("text-purple");
  const pinkTextButton = document.getElementById("text-pink");

  const redBackgroundButton = document.getElementById("background-red");
  const greenBackgroundButton = document.getElementById("background-green");
  const yellowBackgroundButton = document.getElementById("background-yellow");
  const blackBackgroundButton = document.getElementById("background-black");
  const whiteBackgroundButton = document.getElementById("background-white");
  const orangeBackgroundButton = document.getElementById("background-orange");
  const tealBackgroundButton = document.getElementById("background-teal");
  const blueBackgroundButton = document.getElementById("background-blue");
  const violetBackgroundButton = document.getElementById("background-violet");
  const purpleBackgroundButton = document.getElementById("background-purple");
  const pinkBackgroundButton = document.getElementById("background-pink");

  const redTitleButton = document.getElementById("title-red");
  const greenTitleButton = document.getElementById("title-green");
  const yellowTitleButton = document.getElementById("title-yellow");
  const blackTitleButton = document.getElementById("title-black");
  const whiteTitleButton = document.getElementById("title-white");
  const orangeTitleButton = document.getElementById("title-orange");
  const tealTitleButton = document.getElementById("title-teal");
  const blueTitleButton = document.getElementById("title-blue");
  const violetTitleButton = document.getElementById("title-violet");
  const purpleTitleButton = document.getElementById("title-purple");
  const pinkTitleButton = document.getElementById("title-pink");

  const inputGreyScaleRange = document.getElementById("grey-scale-range");
  const inputSaturationRange = document.getElementById("saturation-range");
  const inputBrightnessRange = document.getElementById("brightness-range");
  const inputSepiaRange = document.getElementById("sepia-range");
  const inputContrastRange = document.getElementById("contrast-range");
  const inputHueRange = document.getElementById("hue-range");
  const inputInvertRange = document.getElementById("invert-range");
  const fontWeightRange = document.getElementById("font-weight-range");

  const moveImagesToggle = document.getElementById("move-images-mode-toggle");

  function getSetStorage() {
    storage.get(
      storageItems,
      (
        /** @type {{ colorBlindToggle: any; epilepsyToggle: any; magnifyToggle: any; cognitiveDisabilityModeToggle: any; adhdFriendlyModeToggle: any; visuallyImpairedToggle: any; highContrastToggle: any; dyslexiaFriendlyToggle: any; darkContrastToggle: any; monochromeModeToggle: any; lowSaturationToggle: any; highSaturationToggle: any; hideImagesToggle: any; leftAlignButton: any; centerAlignButton: any; rightAlignButton: any; redTextButton: any; greenTextButton: any; yellowTextButton: any; blackTextButton: any; whiteTextButton: any; orangeTextButton: any; tealTextButton: any; blueTextButton: any; violetTextButton: any; purpleTextButton: any; pinkTextButton: any; redBackgroundButton: any; greenBackgroundButton: any; yellowBackgroundButton: any; blackBackgroundButton: any; whiteBackgroundButton: any; orangeBackgroundButton: any; tealBackgroundButton: any; blueBackgroundButton: any; violetBackgroundButton: any; purpleBackgroundButton: any; pinkBackgroundButton: any; redTitleButton: any; greenTitleButton: any; yellowTitleButton: any; blackTitleButton: any; whiteTitleButton: any; orangeTitleButton: any; tealTitleButton: any; blueTitleButton: any; violetTitleButton: any; purpleTitleButton: any; pinkTitleButton: any; }} */ items
      ) => {
        // for (let key in storageItems) {
        //   console.log(key, window["magnifyToggle"]);
        //   // window[key].checked = items[key];
        // }

        // TODO: convert to the abpve loop

        colorBlindToggle.checked = items.colorBlindToggle;

        epilepsyToggle.checked = items.epilepsyToggle;

        magnifyToggle.checked = items.magnifyToggle;

        cognitiveDisabilityModeToggle.checked =
          items.cognitiveDisabilityModeToggle;

        adhdFriendlyModeToggle.checked = items.adhdFriendlyModeToggle;

        visuallyImpairedToggle.checked = items.visuallyImpairedToggle;

        highContrastToggle.checked = items.highContrastToggle;

        dyslexiaFriendlyToggle.checked = items.dyslexiaFriendlyToggle;

        darkContrastToggle.checked = items.darkContrastToggle;

        monochromeModeToggle.checked = items.monochromeModeToggle;

        lowSaturationToggle.checked = items.lowSaturationToggle;

        highSaturationToggle.checked = items.highSaturationToggle;

        hideImagesToggle.checked = items.hideImagesToggle;

        leftAlignButton.checked = items.leftAlignButton;

        centerAlignButton.checked = items.centerAlignButton;

        rightAlignButton.checked = items.rightAlignButton;
        justifyAlignButton.checked = items.justifyAlignButton;
        redTextButton.checked = items.redTextButton;
        boldTextButton = items.boldTextButton;
        italicTextButton = items.italicTextButton;
        underlineTextButton = items.underlineTextButton;
        strikethroughTextButton = items.strikethroughTextButton;
        greenTextButton.checked = items.greenTextButton;

        yellowTextButton.checked = items.yellowTextButton;

        blackTextButton.checked = items.blackTextButton;

        whiteTextButton.checked = items.whiteTextButton;

        orangeTextButton.checked = items.orangeTextButton;

        tealTextButton.checked = items.tealTextButton;

        blueTextButton.checked = items.blueTextButton;

        violetTextButton.checked = items.violetTextButton;

        purpleTextButton.checked = items.purpleTextButton;

        pinkTextButton.checked = items.pinkTextButton;

        redBackgroundButton.checked = items.redBackgroundButton;

        greenBackgroundButton.checked = items.greenBackgroundButton;

        yellowBackgroundButton.checked = items.yellowBackgroundButton;

        blackBackgroundButton.checked = items.blackBackgroundButton;

        whiteBackgroundButton.checked = items.whiteBackgroundButton;

        orangeBackgroundButton.checked = items.orangeBackgroundButton;

        whiteBackgroundButton.checked = items.whiteBackgroundButton;

        tealBackgroundButton.checked = items.tealBackgroundButton;

        blueBackgroundButton.checked = items.blueBackgroundButton;

        violetBackgroundButton.checked = items.violetBackgroundButton;

        purpleBackgroundButton.checked = items.purpleBackgroundButton;

        pinkBackgroundButton.checked = items.pinkBackgroundButton;

        redTitleButton.checked = items.redTitleButton;

        greenTitleButton.checked = items.greenTitleButton;

        yellowTitleButton.checked = items.yellowTitleButton;

        blackTitleButton.checked = items.blackTitleButton;

        whiteTitleButton.checked = items.whiteTitleButton;

        orangeTitleButton.checked = items.orangeTitleButton;

        whiteTitleButton.checked = items.whiteTitleButton;

        tealTitleButton.checked = items.tealTitleButton;

        blueTitleButton.checked = items.blueTitleButton;

        violetTitleButton.checked = items.violetTitleButton;

        purpleTitleButton.checked = items.purpleTitleButton;

        pinkTitleButton.checked = items.pinkTitleButton;

        // TODO: fix toggle off
        // moveImagesToggle.checked = items.moveImagesToggle;
      }
    );
  }

  getSetStorage();

  // Get all available fonts in the web browser
  const fonts = [
    "'Roboto', sans-serif",
    "'Zilla Slab Highlight', cursive",
    "'Open Sans', sans-serif",
    "'Spectral', serif",
    "'Slabo 27px', serif",
    "'Lato', sans-serif",
    "'Roboto Condensed', sans-serif",
    "'Oswald', sans-serif",
    "'Source Sans Pro', sans-serif",
    "'Raleway', sans-serif",
    "'Zilla Slab', serif",
    "'Montserrat', sans-serif",
    "'PT Sans', sans-serif",
    "'Roboto Slab', serif",
    "'Merriweather', serif",
    "'Saira Condensed', sans-serif",
    "'Saira', sans-serif",
    "'Open Sans Condensed', sans-serif",
    "'Saira Semi Condensed', sans-serif",
    "'Saira Extra Condensed', sans-serif",
    "'Julee', cursive",
    "'Archivo', sans-serif",
    "'Ubuntu', sans-serif",
    "'Lora', serif",
    "'Manuale', serif",
    "'Asap Condensed', sans-serif",
    "'Faustina', serif",
    "'Cairo', sans-serif",
    "'Playfair Display', serif",
    "'Droid Serif', serif",
    "'Noto Sans', sans-serif",
    "'PT Serif', serif",
    "'Droid Sans', sans-serif",
    "'Arimo', sans-serif",
    "'Poppins', sans-serif",
    "'Sedgwick Ave Display', cursive",
    "'Titillium Web', sans-serif",
    "'Muli', sans-serif",
    "'Sedgwick Ave', cursive",
    "'Indie Flower', cursive",
    "'Mada', sans-serif",
    "'PT Sans Narrow', sans-serif",
    "'Noto Serif', serif",
    "'Bitter', serif",
    "'Dosis', sans-serif",
    "'Josefin Sans', sans-serif",
    "'Inconsolata', monospace",
    "'Bowlby One SC', cursive",
    "'Oxygen', sans-serif",
    "'Arvo', serif",
    "'Hind', sans-serif",
    "'Cabin', sans-serif",
    "'Fjalla One', sans-serif",
    "'Anton', sans-serif",
    "'Cairo', sans-serif",
    "'Playfair Display', serif",
    "'Droid Serif', serif",
    "'Noto Sans', sans-serif",
    "'PT Serif', serif",
    "'Droid Sans', sans-serif",
    "'Arimo', sans-serif",
    "'Poppins', sans-serif",
    "'Sedgwick Ave Display', cursive",
    "'Titillium Web', sans-serif",
    "'Muli', sans-serif",
    "'Sedgwick Ave', cursive",
    "'Indie Flower', cursive",
    "'Mada', sans-serif",
    "'PT Sans Narrow', sans-serif",
    "'Noto Serif', serif",
    "'Bitter', serif",
    "'Dosis', sans-serif",
    "'Josefin Sans', sans-serif",
    "'Inconsolata', monospace",
    "'Bowlby One SC', cursive",
    "'Oxygen', sans-serif",
    "'Arvo', serif",
    "'Hind', sans-serif",
    "'Cabin', sans-serif",
    "'Fjalla One', sans-serif",
    "'Anton', sans-serif",
    "'Acme', sans-serif",
    "'Archivo Narrow', sans-serif",
    "'Mukta Vaani', sans-serif",
    "'Play', sans-serif",
    "'Cuprum', sans-serif",
    "'Maven Pro', sans-serif",
    "'EB Garamond', serif",
    "'Passion One', cursive",
    "'Ropa Sans', sans-serif",
    "'Francois One', sans-serif",
    "'Archivo Black', sans-serif",
    "'Pathway Gothic One', sans-serif",
    "'Exo', sans-serif",
    "'Vollkorn', serif",
    "'Libre Franklin', sans-serif",
    "'Crete Round', serif",
    "'Alegreya', serif",
    "'PT Sans Caption', sans-serif",
    "'Alegreya Sans', sans-serif",
    "'Source Code Pro', monospace",
  ];

  // Create a dropdown list
  const selectFont = document.getElementById("font-selector");

  // Add font options to the dropdown list
  for (let i = 0; i < fonts.length; i++) {
    const option = document.createElement("option");
    option.text = fonts[i].trim();
    option.value = fonts[i].trim();
    selectFont.add(option);
  }

  selectFont.addEventListener("change", async (e) => {
    await executeScriptFunc(changeFont, e.target.value);
  });

  // TODO: map cursor text to icons and display icons rather than text
  const cursors = {
    auto: "auto",
    default: "default",
    none: "none",
    "context-menu": "context-menu",
    help: "help",
    pointer: "pointer",
    progress: "progress",
    wait: "wait",
    cell: "cell",
    crosshair: "crosshair",
    text: "text",
    "vertical-text": "vertical-text",
    alias: "alias",
    copy: "copy",
    move: "move",
    "no-drop": "no-drop",
    "not-allowed": "not-allowed",
    "all-scroll": "all-scroll",
    "col-resize": "col-resize",
    "row-resize": "row-resize",
    "n-resize": "n-resize",
    "e-resize": "e-resize",
    "s-resize": "s-resize",
    "w-resize": "w-resize",
    "ns-resize": "ns-resize",
    "ew-resize": "ew-resize",
    "ne-resize": "ne-resize",
    "nw-resize": "nw-resize",
    "se-resize": "se-resize",
    "sw-resize": "sw-resize",
    "nesw-resize": "nesw-resize",
    "nwse-resize": "nwse-resize",
  };

  // Create a dropdown list
  const selectCursors = document.getElementById("cursors-selector");

  // Add cursor options to the dropdown list
  for (const [_key, value] of Object.entries(cursors)) {
    const option = document.createElement("option");
    option.text = value;
    option.value = value;
    selectCursors.add(option);
  }

  selectCursors.addEventListener("change", async (e) => {
    await executeScriptFunc(changeCursor, e.target.value);
  });
  inputSaturationRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 120) {
      inputSaturationRange.classList.add("ltpurple");
    }

    if (e.target.value > 140) {
      inputSaturationRange.classList.add("purple");
    }

    if (e.target.value > 160) {
      inputSaturationRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 120) {
      inputSaturationRange.classList.remove("ltpurple");
    }

    if (e.target.value < 140) {
      inputSaturationRange.classList.remove("purple");
    }

    if (e.target.value < 160) {
      inputSaturationRange.classList.remove("pink");
    }

    await executeScriptFunc(setSaturation, true, e.target.value);
  });

  fontWeightRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 200) {
      fontWeightRange.classList.add("ltpurple");
    }

    if (e.target.value > 400) {
      fontWeightRange.classList.add("purple");
    }

    if (e.target.value > 600) {
      fontWeightRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 200) {
      fontWeightRange.classList.remove("ltpurple");
    }

    if (e.target.value < 400) {
      fontWeightRange.classList.remove("purple");
    }

    if (e.target.value < 600) {
      fontWeightRange.classList.remove("pink");
    }

    await executeScriptFunc(setFontWeight, true, e.target.value);
  });
  inputGreyScaleRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 20) {
      inputGreyScaleRange.classList.add("ltpurple");
    }

    if (e.target.value > 40) {
      inputGreyScaleRange.classList.add("purple");
    }

    if (e.target.value > 60) {
      inputGreyScaleRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 20) {
      inputGreyScaleRange.classList.remove("ltpurple");
    }

    if (e.target.value < 40) {
      inputGreyScaleRange.classList.remove("purple");
    }

    if (e.target.value < 60) {
      inputGreyScaleRange.classList.remove("pink");
    }

    await executeScriptFunc(setGreyScale, true, e.target.value);
  });

  inputBrightnessRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 20) {
      inputBrightnessRange.classList.add("ltpurple");
    }

    if (e.target.value > 100) {
      inputBrightnessRange.classList.add("purple");
    }

    if (e.target.value > 120) {
      inputBrightnessRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 20) {
      inputBrightnessRange.classList.remove("ltpurple");
    }

    if (e.target.value < 100) {
      inputBrightnessRange.classList.remove("purple");
    }

    if (e.target.value < 120) {
      inputBrightnessRange.classList.remove("pink");
    }

    await executeScriptFunc(setBrightnessScale, true, e.target.value);
  });

  inputSepiaRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 20) {
      inputSepiaRange.classList.add("ltpurple");
    }

    if (e.target.value > 60) {
      inputSepiaRange.classList.add("purple");
    }

    if (e.target.value > 80) {
      inputSepiaRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 20) {
      inputSepiaRange.classList.remove("ltpurple");
    }

    if (e.target.value < 60) {
      inputSepiaRange.classList.remove("purple");
    }

    if (e.target.value < 80) {
      inputSepiaRange.classList.remove("pink");
    }

    await executeScriptFunc(setSepiaScale, true, e.target.value);
  });

  inputContrastRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 20) {
      inputContrastRange.classList.add("ltpurple");
    }

    if (e.target.value > 100) {
      inputContrastRange.classList.add("purple");
    }

    if (e.target.value > 120) {
      inputContrastRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 20) {
      inputContrastRange.classList.remove("ltpurple");
    }

    if (e.target.value < 100) {
      inputContrastRange.classList.remove("purple");
    }

    if (e.target.value < 120) {
      inputContrastRange.classList.remove("pink");
    }

    await executeScriptFunc(setContrastScale, true, e.target.value);
  });

  inputHueRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 120) {
      inputHueRange.classList.add("ltpurple");
    }

    if (e.target.value > 240) {
      inputHueRange.classList.add("purple");
    }

    if (e.target.value > 320) {
      inputHueRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 120) {
      inputHueRange.classList.remove("ltpurple");
    }

    if (e.target.value < 240) {
      inputHueRange.classList.remove("purple");
    }

    if (e.target.value < 320) {
      inputHueRange.classList.remove("pink");
    }

    await executeScriptFunc(setHueRotation, true, e.target.value);
  });

  inputInvertRange.addEventListener("input", async (e) => {
    //Change slide thumb color on way up

    if (e.target.value > 20) {
      inputInvertRange.classList.add("ltpurple");
    }

    if (e.target.value > 60) {
      inputInvertRange.classList.add("purple");
    }

    if (e.target.value > 80) {
      inputInvertRange.classList.add("pink");
    }

    //Change slide thumb color on way down

    if (e.target.value < 20) {
      inputInvertRange.classList.remove("ltpurple");
    }

    if (e.target.value < 60) {
      inputInvertRange.classList.remove("purple");
    }

    if (e.target.value < 80) {
      inputInvertRange.classList.remove("pink");
    }

    await executeScriptFunc(setInvert, true, e.target.value);
  });

  // TODO: Refactor to a for loop/map
  leftAlignButton?.addEventListener("change", async (e) => {
    storage.set({
      rightAlignButton: false,
      centerAlignButton: false,
      justifyAlignButton: false,
    });

    if (e.target.checked) {
      storage.set({
        leftAlignButton: true,
      });

      await executeScriptFunc(leftAlignMode, true);
    }
  });

  centerAlignButton?.addEventListener("change", async (e) => {
    storage.set({
      rightAlignButton: false,
      leftAlignButton: false,
      justifyAlignButton: false,
    });

    if (e.target.checked) {
      storage.set({
        centerAlignButton: true,
      });

      await executeScriptFunc(centerAlignMode, true);
    }
  });

  rightAlignButton?.addEventListener("change", async (e) => {
    storage.set({
      leftAlignButton: false,
      centerAlignButton: false,
      justifyAlignButton: false,
    });

    if (e.target.checked) {
      storage.set({
        rightAlignButton: true,
      });
      await executeScriptFunc(rightAlignMode, true);
    }
  });

  justifyAlignButton?.addEventListener("change", async (e) => {
    storage.set({
      leftAlignButton: false,
      centerAlignButton: false,
      rightAlignButton: false,
    });

    if (e.target.checked) {
      storage.set({
        justifyAlignButton: true,
      });
      await executeScriptFunc(justifyAlignMode, true);
    }
  });

  boldTextButton?.addEventListener("change", async (e) => {
    storage.set({
      italicTextButton: false,
      underlineTextButton: false,
      strikethroughTextButton: false,
    });

    if (e.target.checked) {
      storage.set({
        boldTextButton: true,
      });

      await executeScriptFunc(boldTextMode, true);
      await executeScriptFunc(italicTextMode, false);
      await executeScriptFunc(underlineTextMode, false);
      await executeScriptFunc(strikethroughTextMode, false);
    }
  });

  italicTextButton?.addEventListener("change", async (e) => {
    storage.set({
      boldTextButton: false,
      underlineTextButton: false,
      strikethroughTextButton: false,
    });

    if (e.target.checked) {
      storage.set({
        italicTextButton: true,
      });

      await executeScriptFunc(italicTextMode, true);
      await executeScriptFunc(boldTextMode, false);
      await executeScriptFunc(underlineTextMode, false);
      await executeScriptFunc(strikethroughTextMode, false);
    }
  });

  underlineTextButton?.addEventListener("change", async (e) => {
    storage.set({
      boldTextButton: false,
      italicTextButton: false,
      strikethroughTextButton: false,
    });

    if (e.target.checked) {
      storage.set({
        underlineTextButton: true,
      });

      await executeScriptFunc(underlineTextMode, true);
      await executeScriptFunc(boldTextMode, false);
      await executeScriptFunc(italicTextMode, false);
      await executeScriptFunc(strikethroughTextMode, false);
    }
  });

  strikethroughTextButton?.addEventListener("change", async (e) => {
    storage.set({
      boldTextButton: false,
      italicTextButton: false,
      underlineTextButton: false,
    });

    if (e.target.checked) {
      storage.set({
        strikethroughTextButton: true,
      });

      await executeScriptFunc(strikethroughTextMode, true);
      await executeScriptFunc(boldTextMode, false);
      await executeScriptFunc(italicTextMode, false);
      await executeScriptFunc(underlineTextMode, false);
    }
  });

  // TODO: use executeScriptFunc

  colorBlindToggle?.addEventListener("change", function (e) {
    storage.set({
      colorBlindToggle: this.checked,
    });

    chrome.tabs.query(
      { active: true, currentWindow: true },
      (/** @type {{ id: any; }[]} */ tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: toggleColorBlindMode,

          args: [this.checked],
        });
      }
    );
  });

  hideImagesToggle?.addEventListener("change", async (e) => {
    storage.set({
      hideImagesToggle: e.target.checked,
    });

    await executeScriptFunc(hideImages, e.target.checked);
  });

  // TODO: Refactor for (let button in [redTextButton, greenTextButton, ...])
  // TODO: Define the object at the start of the script and replace repetitive code.
  redTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: e.target.checked,
      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "red");
  });

  greenTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: e.target.checked,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "green");
  });

  yellowTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,

      yellowTextButton: e.target.checked,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "yellow");
  });

  blackTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,

      blackTextButton: e.target.checked,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "black");
  });

  whiteTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,

      whiteTextButton: e.target.checked,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "white");
  });
  orangeTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,

      orangeTextButton: e.target.checked,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "orange");
  });

  tealTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,

      tealTextButton: e.target.checked,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "teal");
  });
  blueTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,

      blueTextButton: e.target.checked,
      violetTextButton: false,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "blue");
  });
  violetTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,

      violetTextButton: e.target.checked,
      purpleTextButton: false,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "violet");
  });
  purpleTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,

      purpleTextButton: e.target.checked,
      pinkTextButton: false,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "purple");
  });
  pinkTextButton?.addEventListener("change", async (e) => {
    storage.set({
      redTextButton: false,

      greenTextButton: false,
      yellowTextButton: false,
      blackTextButton: false,
      whiteTextButton: false,
      orangeTextButton: false,
      tealTextButton: false,
      blueTextButton: false,
      violetTextButton: false,
      purpleTextButton: false,

      pinkTextButton: e.target.checked,
    });

    await executeScriptFunc(setTextColor, e.target.checked, "pink");
  });

  // Background color

  redBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: e.target.checked,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "red");
  });

  greenBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,

      greenBackgroundButton: e.target.checked,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "green");
  });

  yellowBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,

      yellowBackgroundButton: e.target.checked,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "yellow");
  });

  blackBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,

      blackBackgroundButton: e.target.checked,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "black");
  });

  whiteBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,

      whiteBackgroundButton: e.target.checked,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "white");
  });
  orangeBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,

      orangeBackgroundButton: e.target.checked,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "orange");
  });

  tealBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,

      tealBackgroundButton: e.target.checked,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "teal");
  });
  blueBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,

      blueBackgroundButton: e.target.checked,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "blue");
  });
  violetBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,

      violetBackgroundButton: e.target.checked,
      purpleBackgroundButton: false,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "violet");
  });
  purpleBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,

      purpleBackgroundButton: e.target.checked,
      pinkBackgroundButton: false,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "purple");
  });
  pinkBackgroundButton?.addEventListener("change", async (e) => {
    storage.set({
      redBackgroundButton: false,
      greenBackgroundButton: false,
      yellowBackgroundButton: false,
      blackBackgroundButton: false,
      whiteBackgroundButton: false,
      orangeBackgroundButton: false,
      tealBackgroundButton: false,
      blueBackgroundButton: false,
      violetBackgroundButton: false,
      purpleBackgroundButton: false,

      pinkBackgroundButton: e.target.checked,
    });

    await executeScriptFunc(setBackgroundColor, e.target.checked, "pink");
  });

  // titles colors

  redTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: e.target.checked,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "red");
  });
  greenTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,

      greenTitleButton: e.target.checked,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "green");
  });
  yellowTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,

      yellowTitleButton: e.target.checked,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "yellow");
  });
  blackTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,

      blackTitleButton: e.target.checked,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "black");
  });
  whiteTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,

      whiteTitleButton: e.target.checked,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "white");
  });
  orangeTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,

      orangeTitleButton: e.target.checked,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "orange");
  });
  tealTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,

      tealTitleButton: e.target.checked,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "teal");
  });
  blueTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,

      blueTitleButton: e.target.checked,
      violetTitleButton: false,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "blue");
  });
  violetTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,

      violetTitleButton: e.target.checked,
      purpleTitleButton: false,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "violet");
  });
  purpleTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,

      purpleTitleButton: e.target.checked,
      pinkTitleButton: false,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "purple");
  });

  pinkTitleButton?.addEventListener("change", async (e) => {
    storage.set({
      redTitleButton: false,
      greenTitleButton: false,
      yellowTitleButton: false,
      blackTitleButton: false,
      whiteTitleButton: false,
      orangeTitleButton: false,
      tealTitleButton: false,
      blueTitleButton: false,
      violetTitleButton: false,
      purpleTitleButton: false,

      pinkTitleButton: e.target.checked,
    });

    await executeScriptFunc(setTitleColor, e.target.checked, "pink");
  });

  moveImagesToggle?.addEventListener("change", async (e) => {
    storage.set({
      moveImagesToggle: e.target.checked,
    });

    await executeScriptFunc(toggleMovePictures, e.target.checked);
  });

  monochromeModeToggle?.addEventListener("change", function () {
    storage.set({
      monochromeModeToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: monochromeMode,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: monochromeMode,
            args: [false],
          });
        }
      );
    }
  });

  highContrastToggle?.addEventListener("change", function () {
    storage.set({
      highContrastToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highContrast,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highContrast,
            args: [false],
          });
        }
      );
    }
  });
  darkContrastToggle?.addEventListener("change", function () {
    storage.set({
      darkContrastToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: darkContrast,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: darkContrast,
            args: [false],
          });
        }
      );
    }
  });

  highSaturationToggle?.addEventListener("change", function () {
    storage.set({
      highSaturationToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highSaturation,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highSaturation,
            args: [false],
          });
        }
      );
    }
  });
  lowSaturationToggle?.addEventListener("change", function () {
    storage.set({
      lowSaturationToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: lowSaturation,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: lowSaturation,
            args: [false],
          });
        }
      );
    }
  });

  visuallyImpairedToggle?.addEventListener("change", function () {
    storage.set({
      visuallyImpairedToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: adjustColors,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: adjustColors,
            args: [false],
          });
        }
      );
    }
  });

  epilepsyToggle?.addEventListener("change", function () {
    storage.set({
      epilepsyToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleEpilepsySwitchFunction,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleEpilepsySwitchFunction,
            args: [false],
          });
        }
      );
    }
  });
  cognitiveDisabilityModeToggle?.addEventListener("change", function () {
    /* ZC91L28vbS9oL2EvbQ */
    storage.set({
      cognitiveDisabilityModeToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highlightElements,
            args: [true],
          });
        }
      );
    } else {
      /* aC9jL3Uvby9tL3IvYS9o */

      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highlightElements,
            args: [false],
          });
        }
      );
    }
  });

  adhdFriendlyModeToggle?.addEventListener("change", function () {
    storage.set({
      adhdFriendlyModeToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleAdhdMode,
            args: [true],
          });
        }
      );
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeCursor,
            args: ["none"],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleAdhdMode,
            args: [false],
          });
        }
      );
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: changeCursor,
            args: ["default"],
          });
        }
      );
    }
  });

  magnifyToggle?.addEventListener("change", function (_e) {
    storage.set({
      magnifyToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleTooltip,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleTooltip,
            args: [false],
          });
        }
      );
    }
  });

  dyslexiaFriendlyToggle?.addEventListener("change", function (_e) {
    storage.set({
      dyslexiaFriendlyToggle: this.checked,
    });

    if (this.checked) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleDyslexiaMode,
            args: [true],
          });
        }
      );
    } else {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (/** @type {{ id: any; }[]} */ tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: toggleDyslexiaMode,
            args: [false],
          });
        }
      );
    }
  });
});

/**
 * @param {Boolean} on
 */
function toggleAdhdMode(on) {
  const flashlight = document.createElement("div");
  flashlight.className = "flashlight";

  flashlight.style =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;";

  flashlight.setAttribute("id", "flashlight");
  const overlay = document.createElement("div");

  overlay.style =
    "position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,0.8);mix-blend-mode:difference;z-index:9999;";
  const rectangle = document.createElement("div");

  rectangle.style =
    "position:absolute;width:200px;height:200px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 9999px rgba(0,0,0,0.8);z-index:99999;";
  rectangle.classList.add("rectangle");
  overlay.classList.add("overlay");
  flashlight.appendChild(overlay);
  flashlight.appendChild(rectangle);

  /**
   * @param {{ clientX: any; clientY: any; }} e
   */
  function moveFlashlight(e) {
    const x = e.clientX;
    const y = e.clientY;
    const rectangleSize = 150;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = x - rectangleSize / 2;
    let top = y - rectangleSize / 2;
    let right = x + rectangleSize / 2;
    let bottom = y + rectangleSize / 2;

    if (left < 0) {
      right = right - left;
      left = 0;
    }

    if (right > screenWidth) {
      left = left - (right - screenWidth);
      right = screenWidth;
    }

    if (top < 0) {
      bottom = bottom - top;
      top = 0;
    }

    if (bottom > screenHeight) {
      top = top - (bottom - screenHeight);
      bottom = screenHeight;
    }

    rectangle.style.left = left + "px";
    rectangle.style.top = top + "px";
    rectangle.style.width = rectangleSize + "px";
    rectangle.style.height = rectangleSize + "px";
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
  }

  function removeFlashlight() {
    document.querySelectorAll(".flashlight").forEach((el) => el.remove());
    document
      .getElementsByTagName("body")[0]
      .removeEventListener("mousemove", removeFlashlight);
    document
      .getElementsByTagName("body")[0]
      .removeEventListener("mouseover", removeFlashlight);
  }

  function showFlashlight() {
    document.getElementsByTagName("body")[0].appendChild(flashlight);
    document
      .getElementsByTagName("body")[0]
      .removeEventListener("mouseover", showFlashlight);
  }
  if (on) {
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mousemove", moveFlashlight);
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mouseover", showFlashlight);
  } else {
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mousemove", removeFlashlight);
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mouseover", removeFlashlight);
  }
}

/**
 * @param {any} size
 */
function updateFontSizeIndicator(size) {
  const fontSizeIndicator = document.getElementById("font-size-indicator");
  if (fontSizeIndicator) {
    fontSizeIndicator.textContent = `${size}px`;
  }
}
async function decreaseFontSize() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: decreaseFontSizeFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getFontSize" },
        function (/** @type {{ fontSize: any; }} */ response) {
          if (response) {
            updateFontSizeIndicator(response.fontSize);
          }
        }
      );
    }
  );
}

// Increase font size of all text on current webpage
async function increaseFontSize() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: increaseFontSizeFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getFontSize" },
        function (/** @type {{ fontSize: any; }} */ response) {
          if (response) {
            updateFontSizeIndicator(response.fontSize);
          }
        }
      );
    }
  );
}

// Increase line height of all text on current webpage
async function increaseLineHeight() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: increaseLineHeightFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getLineHeight" },
        function (/** @type {any} */ response) {
          if (response) {
            // TODO: update indicator
          }
        }
      );
    }
  );
}

// Decrease line height of all text on current webpage
async function decreaseLineHeight() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: decreaseLineHeightFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getLineHeight" },
        function (/** @type {any} */ response) {
          if (response) {
            // TODO: update indicator
          }
        }
      );
    }
  );
}
// Increase letter spacing of all text on current webpage
async function increaseLetterSpacing() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: increaseLetterSpacingFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getLetterSpacing" },
        function (/** @type {any} */ response) {
          if (response) {
            // TODO: update indicator
          }
        }
      );
    }
  );
}

// Decrease letter spacing of all text on current webpage
async function decreaseLetterSpacing() {
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (/** @type {{ id: any; }[]} */ tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: decreaseLetterSpacingFunction,
        args: [""],
      });

      await chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "getLetterSpacing" },
        function (/** @type {any} */ response) {
          if (response) {
            // TODO: update indicator
          }
        }
      );
    }
  );
}
/**
 * @param {Boolean} on
 */
function toggleEpilepsySwitchFunction(on) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML =
      "body.no-transition *{ -webkit-transition: none !important; -moz-transition: none !important; -ms-transition: none !important; -o-transition: none !important; transition: none !important; -webkit-animation-fill-mode: forwards !important; -moz-animation-fill-mode: forwards !important; -ms-animation-fill-mode: forwards !important; -o-animation-fill-mode: forwards !important; animation-fill-mode: forwards !important; -webkit-animation-iteration-count: 1 !important; -moz-animation-iteration-count: 1 !important; -ms-animation-iteration-count: 1 !important; -o-animation-iteration-count: 1 !important; animation-iteration-count: 1 !important; -webkit-animation-duration: .01s !important; -moz-animation-duration: .01s !important; -ms-animation-duration: .01s !important; -o-animation-duration: .01s !important; animation-duration: .01s !important; } ";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("no-transition");
    // TODO: add collapsable help text on toggle.
    // document
    //   .querySelector(".checkboxfeedback")
    //   ?.insertAdjacentHTML(
    //     "beforeend",
    //     "<br />Event occurred on checkbox! Type: " + " checkbox state now: "
    //   );
  } else {
    document.body.classList.remove("no-transition");
  }
}

/**
 * @param {Boolean} on
 */
function toggleDyslexiaMode(on) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML =
      "@font-face {font-family: 'opendyslexic';src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-Regular.otf');font-style: normal;font-weight: normal;}@font-face {font-family: 'opendyslexic';src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-Italic.ttf');font-style: italic;font-weight: normal;}@font-face {font-family: 'opendyslexic';src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-Bold.ttf');font-weight: bold;font-style: normal;}@font-face {font-family: 'opendyslexic';src: url('http://dyslexicfonts.com/fonts/OpenDyslexic-BoldItalic.ttf');font-weight: bold;font-style: italic;}@font-face {font-family: eulexia;src: url('http://dyslexicfonts.com/fonts/eulexia.ttf');} body.dyslexia-mode * {line-height:150%;font-family:opendyslexic, serif !important;letter-spacing: 0.1ch;font-variant-ligatures: none;word-spacing: 0.5ch;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("dyslexia-mode");
  } else {
    document.body.classList.remove("dyslexia-mode");
  }
}

function decreaseFontSizeFunction() {
  let elements = document.getElementsByTagName("*");
  let newFontSize = 0;
  for (let i = 0; i < elements.length; i++) {
    let fontSize = window
      .getComputedStyle(elements[i], null)
      .getPropertyValue("font-size");
    const currentFontSize = parseFloat(fontSize);
    if (fontSize.includes("px")) {
      newFontSize = currentFontSize / 1.025;
    } else if (fontSize.includes("em")) {
      const fontSizeComputed = parseFloat(
        getComputedStyle(elements[i]).fontSize
      );
      newFontSize = (currentFontSize * fontSizeComputed) / 1.025;
    } else if (fontSize.includes("rem")) {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      newFontSize = (currentFontSize * rootFontSize) / 1.025;
    }

    elements[i].style.fontSize = newFontSize + "px";
  }
  // Get the current font size
  newFontSize = parseFloat(
    window.getComputedStyle(document.body, null).getPropertyValue("font-size")
  );

  document.querySelector("#font-size-indicator").innerText = `${newFontSize}px`;

  // Return the new font size value
  return { fontSize: newFontSize };
}

function increaseFontSizeFunction() {
  let elements = document.getElementsByTagName("*");
  let newFontSize = 0;
  for (let i = 0; i < elements.length; i++) {
    let fontSize = window
      .getComputedStyle(elements[i], null)
      .getPropertyValue("font-size");
    const currentFontSize = parseFloat(fontSize);
    if (fontSize.includes("px")) {
      newFontSize = currentFontSize * 1.025;
    } else if (fontSize.includes("em")) {
      const fontSizeComputed = parseFloat(
        getComputedStyle(elements[i]).fontSize
      );
      newFontSize = currentFontSize * fontSizeComputed * 1.025;
    } else if (fontSize.includes("rem")) {
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      newFontSize = currentFontSize * rootFontSize * 1.025;
    }

    elements[i].style.fontSize = newFontSize + "px";
  }
  // Get the current font size
  newFontSize = parseFloat(
    window.getComputedStyle(document.body, null).getPropertyValue("font-size")
  );

  document.querySelector("#font-size-indicator").innerText = `${newFontSize}px`;

  // Return the new font size value
  return { fontSize: newFontSize };
}

function increaseLineHeightFunction() {
  const els = document.getElementsByTagName("*");
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    const lineHeight = getComputedStyle(el).lineHeight;
    if (lineHeight === "normal") {
      el.style.lineHeight = 1.5;
    } else if (lineHeight.includes("px")) {
      const currentLineHeight = parseFloat(lineHeight);
      const newLineHeight = currentLineHeight * 1.025;

      el.style.lineHeight = newLineHeight + "px";
    } else if (lineHeight.includes("em")) {
      const currentLineHeight = parseFloat(lineHeight);
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const newLineHeight = currentLineHeight * fontSize * 1.025;

      el.style.lineHeight = newLineHeight + "px";
    } else if (lineHeight.includes("rem")) {
      const currentLineHeight = parseFloat(lineHeight);
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const newLineHeight = currentLineHeight * rootFontSize * 1.025;

      el.style.lineHeight = newLineHeight + "px";
    }
  }
}
function decreaseLineHeightFunction() {
  const els = document.getElementsByTagName("*");
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    const lineHeight = getComputedStyle(el).lineHeight;
    if (lineHeight === "normal") {
      el.style.lineHeight = 1.0;
    } else if (lineHeight.includes("px")) {
      const currentLineHeight = parseFloat(lineHeight);
      const newLineHeight = currentLineHeight / 1.025;

      el.style.lineHeight = newLineHeight + "px";
    } else if (lineHeight.includes("em")) {
      const currentLineHeight = parseFloat(lineHeight);
      const fontSize = parseFloat(getComputedStyle(el).fontSize);
      const newLineHeight = (currentLineHeight * fontSize) / 1.025;

      el.style.lineHeight = newLineHeight + "px";
    } else if (lineHeight.includes("rem")) {
      const currentLineHeight = parseFloat(lineHeight);
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const newLineHeight = (currentLineHeight * rootFontSize) / 1.025;

      el.style.lineHeight = newLineHeight + "px";
    }
  }
}

function increaseLetterSpacingFunction() {
  const currentLetterSpacing =
    parseFloat(document.body.style.letterSpacing) || 0;
  const newLetterSpacing = currentLetterSpacing + 1;
  document.body.style.letterSpacing = `${newLetterSpacing}px`;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = `* { letter-spacing: ${newLetterSpacing}px !important; }`;
  document.head.appendChild(styleElement);
}
function decreaseLetterSpacingFunction() {
  const currentLetterSpacing =
    parseFloat(document.body.style.letterSpacing) || 0;
  const newLetterSpacing = currentLetterSpacing - 1;
  document.body.style.letterSpacing = `${newLetterSpacing}px`;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = `* { letter-spacing: ${newLetterSpacing}px !important; }`;
  document.head.appendChild(styleElement);
}
// Adjusts the background color and text color of the website for visually impaired users
/**
 * @param {Boolean} on
 */
function adjustColors(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.visually-impaired * {filter: saturate(105%) !important;font-family: Arial, Helvetica, sans-serif !important;}";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("visually-impaired");
  } else {
    document.body.classList.remove("visually-impaired");
  }
}
/**
 * @param {Boolean} on
 */
function leftAlignMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.align-left, body.align-left h1, body.align-left h1 span, body.align-left h2, body.align-left h2 span, body.align-left h3, body.align-left h3 span, body.align-left h4, body.align-left h4 span, body.align-left h5, body.align-left h5 span, body.align-left h6, body.align-left h6 span, body.align-left p, body.align-left li, body.align-left label, body.align-left input, body.align-left select, body.align-left textarea, body.align-left legend, body.align-left code, body.align-left pre, body.align-left dd, body.align-left dt, body.align-left span, body.align-left blockquote { text-align: left !important; } ";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("align-left");
  } else {
    document.body.classList.remove("align-left");
  }
}
/**
 * @param {Boolean} on
 */
function centerAlignMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.align-center,body.align-center h1,body.align-center h1 span,body.align-center h2,body.align-center h2 span,body.align-center h3,body.align-center h3 span,body.align-center h4,body.align-center h4 span,body.align-center h5,body.align-center h5 span,body.align-center h6,body.align-center h6 span,body.align-center p,body.align-center li,body.align-center label,body.align-center input,body.align-center select,body.align-center textarea,body.align-center legend,body.align-center code,body.align-center pre,body.align-center dd,body.align-center dt,body.align-center span,body.align-center blockquote {text-align: center !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("align-center");
  } else {
    document.body.classList.remove("align-center");
  }
}
/**
 * @param {Boolean} on
 */
function rightAlignMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.align-right,body.align-right h1,body.align-right h1 span,body.align-right h2,body.align-right h2 span,body.align-right h3,body.align-right h3 span,body.align-right h4,body.align-right h4 span,body.align-right h5,body.align-right h5 span,body.align-right h6,body.align-right h6 span,body.align-right p,body.align-right li,body.align-right label,body.align-right input,body.align-right select,body.align-right textarea,body.align-right legend,body.align-right code,body.align-right pre,body.align-right dd,body.align-right dt,body.align-right span,body.align-right blockquote {text-align: right !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("align-right");
  } else {
    document.body.classList.remove("align-right");
  }
}

/**
 * @param {Boolean} on
 */
function justifyAlignMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.align-justify,body.align-justify h1,body.align-justify h1 span,body.align-justify h2,body.align-justify h2 span,body.align-justify h3,body.align-justify h3 span,body.align-justify h4,body.align-justify h4 span,body.align-justify h5,body.align-justify h5 span,body.align-justify h6,body.align-justify h6 span,body.align-justify p,body.align-justify li,body.align-justify label,body.align-justify input,body.align-justify select,body.align-justify textarea,body.align-justify legend,body.align-justify code,body.align-justify pre,body.align-justify dd,body.align-justify dt,body.align-justify span,body.align-justify blockquote {text-align: justify !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("align-justify");
  } else {
    document.body.classList.remove("align-justify");
  }
}

/**
 * @param {Boolean} on
 */
function boldTextMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = "body.bold-text * {font-weight: bold !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("bold-text");
  } else {
    document.body.classList.remove("bold-text");
  }
}

/**
 * @param {Boolean} on
 */
function italicTextMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = "body.italic-text * {font-style: italic !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("italic-text");
  } else {
    document.body.classList.remove("italic-text");
  }
}

/**
 * @param {Boolean} on
 */
function underlineTextMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.underline-text * {text-decoration: underline !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("underline-text");
  } else {
    document.body.classList.remove("underline-text");
  }
}

/**
 * @param {Boolean} on
 */
function strikethroughTextMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.strikethrough-text * {text-decoration: line-through !important;}";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("strikethrough-text");
  } else {
    document.body.classList.remove("strikethrough-text");
  }
}
/**
 * @param {Boolean} on
 */
function highContrast(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.high-contrast * { filter: contrast(135%) !important; }";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }
}

/**
 * @param {Boolean} on
 */
function darkContrast(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.dark-contrast * { background-color: #131212 !important; color: white !important; }";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("dark-contrast");
  } else {
    document.body.classList.remove("dark-contrast");
  }
}

/**
 * @param {Boolean} on
 */
function monochromeMode(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.monochrome * { filter: grayscale(100%) !important; }";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("monochrome");
  } else {
    document.body.classList.remove("monochrome");
  }
}

/**
 * @param {Boolean} on
 */
function highSaturation(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.high-saturation * { filter: saturate(110%) !important; }";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("high-saturation");
  } else {
    document.body.classList.remove("high-saturation");
  }
}

/**
 * @param {Boolean} on
 * @param {Number} value
 */
function setSaturation(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.saturation * { filter: saturate(${value}%)!important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("saturation");
  } else {
    document.body.classList.remove("saturation");
  }
}

/**
 * @param {Boolean} on
 * @param {Number} value
 */
function setFontWeight(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.font-weight * { font-weight: ${value} !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("font-weight");
  } else {
    document.body.classList.remove("font-weight");
  }
}

/**
 * @param {Boolean} on
 * @param {Number} value
 */
function setGreyScale(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.grey-scale * { filter: grayscale(${value}%) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("grey-scale");
  } else {
    document.body.classList.remove("grey-scale");
  }
}
/**
 * @param {Boolean} on
 * @param {Number} value
 */
function setBrightnessScale(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.brightness * { filter: brightness(${value}%) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("brightness");
  } else {
    document.body.classList.remove("brightness");
  }
}

/**
 * @param {Boolean} on
 * @param {Number} value
 */
function setSepiaScale(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.sepia * { filter: sepia(${value}%) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("sepia");
  } else {
    document.body.classList.remove("sepia");
  }
}

/**
 * @param {Boolean} on
 * @param {any} value
 */
function setContrastScale(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.contrast * { filter: contrast(${value}%) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("contrast");
  } else {
    document.body.classList.remove("contrast");
  }
}

/**
 * @param {Boolean} on
 * @param {any} value
 */
function setHueRotation(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.hue-rotate * { filter: hue-rotate(${value}deg) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("hue-rotate");
  } else {
    document.body.classList.remove("hue-rotate");
  }
}

/**
 * @param {Boolean} on
 * @param {any} value
 */
function setInvert(on, value) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML = `body.invert * { filter: invert(${value}%) !important; }`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("invert");
  } else {
    document.body.classList.remove("invert");
  }
}
/**
 * @param {Boolean} on
 */
function lowSaturation(on) {
  if (on) {
    // Set the new background color
    let style = document.createElement("style");
    style.innerHTML =
      "body.low-saturation * { filter: saturate(50%) !important; }";

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("low-saturation");
  } else {
    document.body.classList.remove("low-saturation");
  }
}

/**
 * @param {Boolean} on
 * @param {String} color
 */
function setTextColor(on, color) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML = `body.set-text-colors a,body.set-text-colors p,body.set-text-colors li,body.set-text-colors label,body.set-text-colors input,body.set-text-colors select,body.set-text-colors textarea,body.set-text-colors legend,body.set-text-colors code,body.set-text-colors pre,body.set-text-colors dd,body.set-text-colors dt,body.set-text-colors span,body.set-text-colors blockquote {color: ${color} !important;}`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("set-text-colors");
  } else {
    document.body.classList.remove("set-text-colors");
  }
}

/**
 * @param {Boolean} on
 * @param {String} color
 */
function setBackgroundColor(on, color) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML = `body.set-background-colors *, body.set-background-colors h1, body.set-background-colors h1 span, body.set-background-colors h2, body.set-background-colors h2 span, body.set-background-colors h3, body.set-background-colors h3 span, body.set-background-colors h4, body.set-background-colors h4 span, body.set-background-colors h5, body.set-background-colors h5 span, body.set-background-colors h6, body.set-background-colors h6 span, body.set-background-colors p, body.set-background-colors a, body.set-background-colors li, body.set-background-colors label, body.set-background-colors input, body.set-background-colors select, body.set-background-colors textarea, body.set-background-colors legend, body.set-background-colors code, body.set-background-colors pre, body.set-background-colors dd, body.set-background-colors dt, body.set-background-colors span, body.set-background-colors blockquote {background: ${color}!important;}`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("set-background-colors");
  } else {
    document.body.classList.remove("set-background-colors");
  }
}

/**
 * @param {Boolean} on
 * @param {String} color
 */
function setTitleColor(on, color) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML = `body.set-title-colors h1,body.set-title-colors h1 *,body.set-title-colors h2,body.set-title-colors h2 *,body.set-title-colors h3,body.set-title-colors h3 *,body.set-title-colors h4,body.set-title-colors h4 *,body.set-title-colors h5,body.set-title-colors h5 *,body.set-title-colors h6,body.set-title-colors h6 * {color: ${color}!important;}`;

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("set-title-colors");
  } else {
    document.body.classList.remove("set-title-colors");
  }
}

/**
 * @param {Boolean} _on
 */
function highlightElements(_on) {
  const body = document.body;
  const elementsToHighlight = document.querySelectorAll(
    "button, a, h1, h2, h3, h4, h5, h6"
  );
  if (body.classList.contains("cognitive-disability-mode")) {
    body.classList.remove("cognitive-disability-mode");
    elementsToHighlight.forEach((element) => {
      element.style.removeProperty("border");
    });
  } else {
    body.classList.add("cognitive-disability-mode");
    elementsToHighlight.forEach((element) => {
      element.style.border = "3px solid red";
    });
  }
}

/**
 * @param {Boolean} on
 */
function toggleColorBlindMode(on) {
  if (on) {
    // Shift the hue of the red and green colors towards the blue end of the spectrum. This makes them appear less similar to someone with protanopia.
    let style = document.createElement("style");
    style.innerHTML =
      'body.color-blind h1, body.color-blind h2, body.color-blind h3, body.color-blind h4, body.color-blind h5, body.color-blind h6, body.color-blind a, body.color-blind button, body.color-blind input, body.color-blind label, body.color-blind legend, body.color-blind progress, body.color-blind select, body.color-blind textarea, body.color-blind [role="button"], body.color-blind [role="checkbox"], body.color-blind [role="radio"], body.color-blind [role="switch"], body.color-blind [role="textbox"], body.color-blind blockquote {background-color: #f5f5f5 !important;color: #333333 !important;}body.color-blind h1, body.color-blind h2, body.color-blind h3, body.color-blind h4, body.color-blind h5, body.color-blind h6 {color: #3773b0 !important;;border-color: #8ab6d6 !important;}body.color-blind a {color: #0073cf !important;border-color: #8ab6d6 !important;}body.color-blind input[type="text"], body.color-blind input[type="email"], body.color-blind input[type="password"], body.color-blind textarea, body.color-blind select {border-color: #8ab6d6 !important;}body.color-blind [role="button"], body.color-blind [role="checkbox"], body.color-blind [role="radio"], body.color-blind [role="switch"], body.color-blind [role="textbox"], body.color-blind legend, body.color-blind progress {color: #333333 !important;}body.color-blind ::-moz-selection {background-color: #0073cf !important;color: #ffffff !important;}body.color-blind ::selection {background-color: #0073cf !important;color: #ffffff !important;}body.color-blind img {filter: hue-rotate(-30deg) !important;}';

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("color-blind");
  } else {
    // Remove the 'blind' class from the body of the document
    document.body.classList.remove("color-blind");
  }
}
/**
 * @param {Boolean} on
 */
function hideImages(on) {
  if (on) {
    let style = document.createElement("style");
    style.innerHTML =
      "body.hide-images img, body.hide-images video { opacity: 0 !important; visibility: hidden !important; } body.hide-images * { background-image: none !important; }";
    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.classList.add("hide-images");
  } else {
    document.body.classList.remove("hide-images");
  }
}

/**
 * @param {Boolean} on
 */
function toggleTooltip(on) {
  let tagsToMagnify = [
    "SPAN",
    "P",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "LI",
    "A",
  ];

  // Create a tooltip element
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";

  tooltip.style =
    "position:absolute;background:#fff;color:black;border:2px solid blue;padding:10px;box-shadow:2px 2px 5px rgba(0,0,0,.5);z-index:9999999999;";

  /**
   * @param {any} _event
   */
  function removeTooltip(_event) {
    document.querySelectorAll(".tooltip").forEach((el) => el.remove());
    document
      .getElementsByTagName("body")[0]
      .removeEventListener("mouseover", showTooltip);
  }
  /**
   * @param {any} _enent
   */
  function showTooltip(_enent) {
    const target = event?.target;

    if (tagsToMagnify.indexOf(target?.tagName) > -1) {
      tooltip.innerText = target?.innerText.trim();

      tooltip.style.top = event?.pageY + "px";

      tooltip.style.left = event?.pageX + "px";
      tooltip.style.fontSize = "36px";
      tooltip.style.lineHeight = "42px";
      document.body.appendChild(tooltip);
    }
  }
  if (on) {
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mouseover", showTooltip);
  } else {
    document
      .getElementsByTagName("body")[0]
      .addEventListener("mouseover", removeTooltip);
  }
}
// Function to toggle the picture moving feature
function toggleMovePictures(on) {
  // Add event listeners to all the image elements to enable drag and drop functionality
  if (on) {
    let images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
      images[i].addEventListener("mousedown", function (event) {
        event.preventDefault();
        let image = event.target;

        document.addEventListener("mousemove", moveImage);
        document.addEventListener("mouseup", stopMovingImage);

        function moveImage(event) {
          let currentX = event.clientX;
          let currentY = event.clientY;
          image.style.position = "relative";
          image.style.zIndex = 99999;
          image.style.left = currentX - image.width / 1.2 + "px";
          image.style.top = currentY - image.height / 1.2 + "px";
        }

        function stopMovingImage(_event) {
          document.removeEventListener("mousemove", moveImage);
          document.removeEventListener("mouseup", stopMovingImage);
        }
      });
    }
  } else {
    // TODO: remove event listeners.
    document.removeEventListener("mousemove", moveImage);
    document.removeEventListener("mouseup", stopMovingImage);
  }
}

// Function to change the font of the webpage
function changeFont(font) {
  document.body.classList.remove("change-font");
  let style = document.createElement("style");
  style.innerHTML = `@import url('https://fonts.googleapis.com/css?family=Abel|Abril+Fatface|Acme|Alegreya|Alegreya+Sans|Anton|Archivo|Archivo+Black|Archivo+Narrow|Arimo|Arvo|Asap|Asap+Condensed|Bitter|Bowlby+One+SC|Bree+Serif|Cabin|Cairo|Catamaran|Crete+Round|Crimson+Text|Cuprum|Dancing+Script|Dosis|Droid+Sans|Droid+Serif|EB+Garamond|Exo|Exo+2|Faustina|Fira+Sans|Fjalla+One|Francois+One|Gloria+Hallelujah|Hind|Inconsolata|Indie+Flower|Josefin+Sans|Julee|Karla|Lato|Libre+Baskerville|Libre+Franklin|Lobster|Lora|Mada|Manuale|Maven+Pro|Merriweather|Merriweather+Sans|Montserrat|Montserrat+Subrayada|Mukta+Vaani|Muli|Noto+Sans|Noto+Serif|Nunito|Open+Sans|Open+Sans+Condensed:300|Oswald|Oxygen|PT+Sans|PT+Sans+Caption|PT+Sans+Narrow|PT+Serif|Pacifico|Passion+One|Pathway+Gothic+One|Play|Playfair+Display|Poppins|Questrial|Quicksand|Raleway|Roboto|Roboto+Condensed|Roboto+Mono|Roboto+Slab|Ropa+Sans|Rubik|Saira|Saira+Condensed|Saira+Extra+Condensed|Saira+Semi+Condensed|Sedgwick+Ave|Sedgwick+Ave+Display|Shadows+Into+Light|Signika|Slabo+27px|Source+Code+Pro|Source+Sans+Pro|Spectral|Titillium+Web|Ubuntu|Ubuntu+Condensed|Varela+Round|Vollkorn|Work+Sans|Yanone+Kaffeesatz|Zilla+Slab|Zilla+Slab+Highlight');body.change-font * { font-family: ${font} !important;}`;
  document.getElementsByTagName("head")[0].appendChild(style);
  document.body.classList.add("change-font");
}

// Function to change the cursor of the webpage
function changeCursor(cursor) {
  document.body.classList.remove("change-cursor");
  let style = document.createElement("style");
  style.innerHTML = `body.change-cursor * { cursor: ${cursor} !important;}`;
  document.getElementsByTagName("head")[0].appendChild(style);
  document.body.classList.add("change-cursor");
}
