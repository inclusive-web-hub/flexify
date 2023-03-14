module.exports = {
  setupFiles: ["text-encoding"],
  setupFilesAfterEnv: ["./setupTests.js"],
  testMatch: ["**/__tests__/**/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@babel|my-module)/)"],
  moduleFileExtensions: ["js", "json", "jsx", "node"],
  runner: "jest-runner",
  testRunner: "jest-circus/runner",
  verbose: true,
  globals: {
    browser: {},
  },
  testEnvironmentOptions: {
    esm: {
      nodeResolve: true,
    },
  },
};
