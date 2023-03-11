import { textToSpeech } from "./text-to-speech.js";
import { executeScriptFuncSync } from "./utils.js";

const addPlayButtonOnHighlight = (selection) => {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.pageXOffset;
  const y = rect.top + window.pageYOffset;
  const button = document.createElement("button");
  button.style.position = "absolute";
  button.className = "speech-text";
  button.style.top = y - 10 + "px";
  button.style.left = x + 10 + "px";
  button.innerHTML = "<i class='fa fa-play'></i>";
  document.body.appendChild(button);
  button.addEventListener("click", () => {
    document.querySelectorAll(".speech-text").forEach((el) => el.remove());
    const selectedText = selection.toString();
    if (selectedText) {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //TODO: This is not working
  if (textToSpeech.data.player == null) {
    switch (request.msg) {
      case "initialize_text_to_speech":
        console.log("initialize_text_to_speech");
        4;
        textToSpeech.initialize();
        // executeScriptFuncSync(
        //   textToSpeech.initialize
        // )
        break;
      case "speak_hello_message":
        console.log("speak_hello_message");
        textToSpeech.startTextToSpeech(
          "Highlight a piece of text and click play to listen."
        );
        // executeScriptFuncSync(
        //   textToSpeech.startTextToSpeech,
        //   "Highlight a piece of text and click play to listen."
        // );
        break;
      case "add_play_button":
        console.log("add_play_button");
        const selectedText = request.data.content.toString();
        if (selectedText) {
          executeScriptFuncSync(addPlayButtonOnHighlight, selectedText);
        }
        break;

      default:
      // code block
    }
  } else {
    console.log("Stop current audio");

    textToSpeech.data.isPlaying = false;

    textToSpeech.data.player.pause();

    textToSpeech.data.player = null;
  }
});
