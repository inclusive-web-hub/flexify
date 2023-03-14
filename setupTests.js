// @ts-ignore
global.TextDecoder = require("util").TextDecoder;
global.TextEncoder = require("util").TextEncoder;
global.chrome = {
  runtime: {
    sendMessage: require("jest").fn,
  },
};
