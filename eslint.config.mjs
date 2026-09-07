import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /* the volume is exFAT and macOS writes an AppleDouble twin beside
       every file (._name); they are binary and eslint parsed them as
       source, so every lint run ended in "Invalid character" errors
       from files that are not files */
    "**/._*",
  ]),
]);

export default eslintConfig;
