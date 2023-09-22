module.exports = {
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  env: {
    node: true,
  },
  rules: {
    // disable
    "init-declarations": "off",
    "no-console": "off",
    "no-inline-comments": "off",
  },
};
