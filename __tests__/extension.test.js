// @ts-nocheck
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { resolve } from "path";

const html = readFileSync(resolve(__dirname, "../popup.html"), "utf8");
const scripts = readFileSync(resolve(__dirname, "../scripts/popup.js"), "utf8");

describe("toggleAdhdMode", () => {
  let dom;

  beforeAll(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;
    const scriptEl = window.document.createElement("script");
    scriptEl.textContent = scripts;
    window.document.body.appendChild(scriptEl);
  });

  it("should remove the flashlight element when called with `false`", () => {
    const { window } = dom;
    const on = false;
    window.toggleAdhdMode(on);
    const flashlightEl = window.document.getElementById("flashlight");
    expect(flashlightEl).toBeNull();
  });

  // Add more test cases here
});
