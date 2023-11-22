/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

const path = require("node:path")
const createAliasSetting = require("@vue/eslint-config-airbnb/createAliasSetting")

module.exports = {
  root: true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-airbnb",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  plugins: [
    "unused-imports",
    "simple-import-sort",
    "import",
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "unused-imports/no-unused-imports": "error",
    "vue/multi-word-component-names": "off",
    "import/no-unresolved": "error",
    "no-console": "off",
    "import/no-extraneous-dependencies": "off"
  },
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, "./src")}`
    })
  }
}
