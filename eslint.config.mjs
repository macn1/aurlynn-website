import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist/**", "node_modules/**", "public/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react, "react-hooks": reactHooks },
    rules: { "react/jsx-uses-vars": "error", "react/jsx-uses-react": "off", "no-empty": ["error", { allowEmptyCatch: true }], ...reactHooks.configs.recommended.rules, "react-hooks/set-state-in-effect": "warn", "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }] },
  },
];
