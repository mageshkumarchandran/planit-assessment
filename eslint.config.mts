import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin"; // 1. Import the plugin

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic, // 2. Register the plugin
    },
    rules: {
      // 3. Enforce spacing before and after keywords like 'if', 'else', 'for'
      "@stylistic/keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      // Optional: Enforce space before function parentheses like function() vs function ()
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
    },
  },
);
