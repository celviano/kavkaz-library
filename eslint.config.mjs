import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelop = process.env.NODE_ENV === 'development' ? 1 : 2;
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  { ignores: ['.next', 'node_modules', 'build'] },
  ...compat.extends('next/core-web-vitals'),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',

      // Отключаем базовые правила ESLint в пользу TypeScript-аналогов
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',

      // React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': ['warn', { enforceDynamicLinks: 'always' }],
      'react/jsx-key': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/no-deprecated': 'warn',

      // Доступность
      ...jsxA11yPlugin.configs.recommended.rules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',

      // Fast Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript
      '@typescript-eslint/no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Сортировка импортов
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react$', '^next', '^[a-z]'],
            ['^@'],
            ['^~'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^~/icons'],
            ['^.+\\.s?css$'],
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // Общие правила
      'no-useless-escape': 'warn',
      'no-prototype-builtins': 'warn',
      'no-empty-pattern': 'warn',
      'no-empty': 'warn',
      'no-console': isDevelop,
      'max-len': [
        'error',
        {
          code: 120,
          comments: 200,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'max-lines': [
        'error',
        {
          max: 450,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
);
