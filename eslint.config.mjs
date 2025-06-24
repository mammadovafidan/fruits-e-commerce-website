import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      // Disable unused variable errors
      "@typescript-eslint/no-unused-vars": "off",
      // Disable no-unescaped-entities for quotes and apostrophes in JSX
      "react/no-unescaped-entities": "off",
      // Disable explicit any errors
      "@typescript-eslint/no-explicit-any": "off",
      // Allow unused imports (optional)
      "no-unused-vars": "off",
      "no-unused-imports": "off",
    },
  }),
];

export default eslintConfig;
