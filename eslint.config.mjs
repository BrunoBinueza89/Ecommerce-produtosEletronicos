import globals from "globals";

const lintRules = {
  "no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }]
};

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**"]
  },
  {
    files: ["backendAPI-shopMax/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: lintRules
  },
  {
    files: [
      "backendAPI-shopMax/tests/**/*.js",
      "frontEnd-shopMax/tests/**/*.js",
      "frontEnd-adminPanel/tests/**/*.js"
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: lintRules
  },
  {
    files: ["frontEnd-shopMax/**/*.js", "frontEnd-adminPanel/**/*.js"],
    ignores: ["frontEnd-shopMax/tests/**/*.js", "frontEnd-adminPanel/tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: lintRules
  }
];
