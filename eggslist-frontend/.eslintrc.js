module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {},
  settings: {
    "import/resolver": {
      nuxt: {
        extensions: [".js", ".vue"],
      },
    },
  },
};
