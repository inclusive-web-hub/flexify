// @ts-nocheck
import { generateChunks, generateToken } from "./utils.js";

export let textToSpeech = {
  data: {
    googleTtsLink:
      "http://translate.google.com/translate_tts?ie=UTF-8" +
      "&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}" +
      "&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}",
    maxTtsLength: 160,
    isPlaying: false,
    player: null,
    languagesData: null,
    highlightedText: "",
  },
  initialize: () => {
    const url = chrome.runtime.getURL("../data/languages.json");
    fetch(url)
      .then((response) => response.json()) // file contains json

      .then((json) => (textToSpeech.data.languagesData = json));
  },
  detectLanguage: (
    /** @type {string} */ text,
    /** @type {(arg0: any) => void} */ callback
  ) => {
    $.ajax({
      type: "GET",
      url:
        "https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&client=gtx&sl=auto&tl=en&q=" +
        text +
        "&hl=en-US&dj=1&tk=" +
        generateToken(text),
      cache: true,
      async: true,
      headers: { "Content-type": "application/json; charset=utf-8" },
      success: function (responseText) {
        let lang = responseText.src;
        callback(lang);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        callback();
      },
    });
  },
  loadAudio: (
    /** @type {string | URL} */ link,
    /** @type {(arg0: string | ArrayBuffer | null) => void} */ on_loaded_callback
  ) => {
    $.ajax({
      type: "GET",
      url: link,
      cache: true,
      xhr: function () {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        return xhr;
      },
      headers: { "Content-type": "application/json; charset=utf-8" },
      success: function (responseText) {
        let blob = new Blob([responseText], { type: "audio/mpeg" });
        let reader = new FileReader();
        reader.addEventListener("loadend", function () {
          on_loaded_callback(reader.result);
        });
        reader.readAsDataURL(blob);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        on_loaded_callback();
      },
    });
  },

  startTextToSpeech: (/** @type {string} */ text) => {
    textToSpeech.detectLanguage(text, function (/** @type {string} */ lang) {
      if (textToSpeech.data.languagesData?.indexOf(lang) > -1) {
        let chunks = generateChunks(text, textToSpeech.data.maxTtsLength);
        let audios = [];

        let startPlayingChunks = function (/** @type {number} */ i) {
          if (i >= chunks.length) {
            textToSpeech.onAudioStopCallback();
            return;
          }

          if (!textToSpeech.data.isPlaying) {
            return;
          }

          while (i >= audios.length);

          textToSpeech.speak(audios[i], function () {
            startPlayingChunks(i + 1);
          });
        };

        let loadAudios = function (/** @type {string | number} */ i) {
          if (i >= chunks.length) {
            return;
          }

          textToSpeech.loadAudio(
            textToSpeech.getTextToSpeechLink(chunks[i], lang),
            function (/** @type {any} */ audio) {
              audios.push(audio);

              if (i === 0) {
                textToSpeech.data.isPlaying = true;
                startPlayingChunks(0);
              }

              loadAudios(i + 1);
            }
          );
        };

        loadAudios(0);
      }
    });
  },
  speak: (
    /** @type {string | undefined} */ audio,
    /** @type {() => void} */ on_end_callback
  ) => {
    textToSpeech.data.player = new Audio(audio);

    textToSpeech.data.player.onerror = function () {};

    textToSpeech.data.player.onended = function () {
      on_end_callback();
      textToSpeech.data.player = null;
    };

    textToSpeech.data.player.play();
  },
  getTextToSpeechLink: (
    /** @type {{ split: (arg0: string) => { (): any; new (): any; length: any; }; length: any; }} */ text,
    /** @type {any} */ lang
  ) => {
    return textToSpeech.data.googleTtsLink
      .replace("{{text}}", text)
      .replace("{{lang}}", lang)

      .replace("{{textparts}}", text.split(" ").length)

      .replace("{{textlen}}", text.length)
      .replace("{{dictation_speed}}", "1.0");
  },
  onAudioStopCallback: () => {},
};
