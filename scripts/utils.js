export const executeScriptFunc = async (
  /** @type {Function} */ func,
  /** @type {any} */ ...args
) => {
  // @ts-ignore
  await chrome.tabs.query(
    { active: true, currentWindow: true },
    (/** @type {{ id: any; }[]} */ tabs) => {
      // @ts-ignore
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: func,
        args: [...args],
      });
    }
  );
};
export const executeScriptFuncSync = (
  /** @type {Function} */ func,
  /** @type {any} */ ...args
) => {
  // @ts-ignore
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (/** @type {{ id: any; }[]} */ tabs) => {
      // @ts-ignore
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: func,
        args: [...args],
      });
    }
  );
};

/**
 * @param {string} text
 * @param {number} max_len
 */
export const generateChunks = (text, max_len) => {
  let words = text.split(" ");
  let chunks = [""];

  for (let i = 0, len = words.length, j = 0; i < len; ++i) {
    let nw = chunks[j] + " " + words[i];

    if (nw.length < max_len) {
      chunks[j] = nw.trim();
    } else {
      ++j;
      chunks[j] = words[i];
    }
  }

  return chunks;
};

/**
 *
 * @param {number} hash - the initial value of the hash
 * @param {string | any[]} text - the input string that is used to update the hash.
 */
export const encrypt = (hash, text) => {
  for (let i = 0; i < text.length - 2; i += 3) {
    let charCode = text[i + 2];
    charCode = "a" <= charCode ? charCode.charCodeAt(0) - 87 : Number(charCode);
    charCode = "+" == text[i + 1] ? hash >>> charCode : hash << charCode;
    hash = "+" == text[i] ? (hash + charCode) & 4294967295 : hash ^ charCode;
  }
  return hash;
};
/**
 * @param {string} text
 */
export const generateToken = (text) => {
  let charCodeList = [];

  for (let i = 0, byteCount = 0; i < text.length; ++i) {
    let charCode = text.charCodeAt(i);

    if (charCode < 128) {
      charCodeList[byteCount++] = charCode;
    } else {
      if (charCode < 2048) {
        charCodeList[byteCount++] = (charCode >> 6) | 192;
      } else {
        charCodeList[byteCount++] = (charCode >> 12) | 224;
        charCodeList[byteCount++] = ((charCode >> 6) & 63) | 128;
      }
      charCodeList[byteCount++] = (charCode & 63) | 128;
    }
  }

  let tokenSum = 0;
  let tokenFunctionName = 0;

  for (let byteCount = 0; byteCount < charCodeList.length; byteCount++) {
    tokenSum += charCodeList[byteCount];
    tokenSum = encrypt(tokenSum, "+-a^+6");
  }

  tokenSum = encrypt(tokenSum, "+-3^+b+-f");

  if (0 > tokenSum) {
    tokenSum = (tokenSum & 2147483647) + 2147483648;
  }
  tokenSum %= 1e6;

  return tokenSum.toString() + "." + (tokenSum ^ tokenFunctionName).toString();
};
