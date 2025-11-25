/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  env: {
    browser: true,
    es2022: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
};
