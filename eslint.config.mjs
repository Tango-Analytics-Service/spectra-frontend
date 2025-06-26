import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ["tailwind.config.js", "vite.config.ts"],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: "./tsconfig.json", // Required for typed linting
            },
        },
        plugins: {
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            'jsx-a11y': eslintPluginJsxA11y,
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...eslintPluginReact.configs.recommended.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,
            ...eslintPluginJsxA11y.configs.recommended.rules,
            ...typescriptEslint.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            // React
            "react/react-in-jsx-scope": "off",
            // Stylistic
            semi: ["error", "always"],
            indent: ['error', 4],
            quotes: ["error", "double"],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]);
