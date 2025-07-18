import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import eslintImport from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig([
    {
        files: ["**/*.{js,jsx,mjs,ts,tsx}"],
        ignores: [
            "dist/**",
            "tailwind.config.js",
            "postcss.config.js",
        ],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: "latest",
                sourceType: "module",
                project: ["./tsconfig.json", "./tsconfig.node.json"], // Required for typed linting
            },
        },
        plugins: {
            react: eslintPluginReact,
            import: eslintImport,
            "@stylistic": stylistic,
            "react-hooks": eslintPluginReactHooks,
            "jsx-a11y": eslintPluginJsxA11y,
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            ...eslintPluginReact.configs.recommended.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,
            ...eslintPluginJsxA11y.configs.recommended.rules,
            ...typescriptEslint.configs.recommended.rules,
            // "@typescript-eslint/no-unused-vars": ["error", {
            //     varsIgnorePattern: "^_",
            // }],
            "@typescript-eslint/no-unused-vars": "off",
            "import/no-unused-modules": ["error", {
                unusedExports: true,
            }],
            // React
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "react/function-component-definition": ["error", {
                namedComponents: "function-declaration",
                unnamedComponents: "arrow-function",
            }],
            "react/no-multi-comp": "error",
            "react/no-unstable-nested-components": "error",
            // Stylistic
            "@stylistic/semi": ["error", "always"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "double"],
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
