import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "logs", "**/*.d.ts"],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
      // parserOptions: {
      //   project: true,
      //   tsconfigRootDir: import.meta.dirname,
      // },
    },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  // tseslint.configs.recommendedTypeChecked,
]);
