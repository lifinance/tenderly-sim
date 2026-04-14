'use strict'

const tseslint = require('typescript-eslint')
const prettierRecommended = require('eslint-plugin-prettier/recommended')
const importPlugin = require('eslint-plugin-import')
const unusedImports = require('eslint-plugin-unused-imports')
const jestPlugin = require('eslint-plugin-jest')
const globals = require('globals')

module.exports = tseslint.config(
  {
    ignores: [
      'build/**',
      'node_modules/**',
      '.github/**',
      '**/*.json',
      '*.config.js',
      '*.config.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-negated-condition': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-console': 'error',
      '@typescript-eslint/return-await': ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-deprecated': 'warn',
      'no-implicit-coercion': 'error',
      'max-params': ['error', { max: 5 }],
      'max-lines-per-function': [
        'error',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines': [
        'error',
        {
          max: 250,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ['error', { max: 5 }],
      'import/default': 'error',
      'import/export': 'error',
      'import/exports-last': 'off',
      'import/first': 'error',
      'import/group-exports': 'off',
      'import/max-dependencies': ['error', { max: 50 }],
      'import/namespace': ['error', { allowComputed: true }],
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-amd': 'error',
      'import/no-anonymous-default-export': 'off',
      'import/no-commonjs': 'error',
      'import/no-cycle': 'error',
      'import/no-default-export': 'off',
      'import/no-deprecated': 'warn',
      'import/no-duplicates': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.spec.ts'],
          includeTypes: true,
        },
      ],
      'import/no-mutable-exports': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'error',
      'import/no-named-default': 'error',
      'import/no-namespace': 'off',
      'import/no-nodejs-modules': 'off',
      'import/no-self-import': 'error',
      'import/no-unassigned-import': ['error'],
      'import/no-unresolved': 'error',
      'import/no-restricted-paths': ['error'],
      // Disabled: import/no-unused-modules is incompatible with ESLint 9 flat config
      // See https://github.com/import-js/eslint-plugin-import/issues/3079
      'import/no-unused-modules': 'off',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/prefer-default-export': 'off',
      'import/unambiguous': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'type'],
            ['sibling', 'index'],
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    ...jestPlugin.configs['flat/recommended'],
    languageOptions: {
      ...jestPlugin.configs['flat/recommended'].languageOptions,
      globals: {
        ...globals.es2022,
        ...globals.node,
        ...jestPlugin.configs['flat/recommended'].languageOptions?.globals,
      },
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/consistent-test-it': [
        'error',
        {
          fn: 'it',
          withinDescribe: 'it',
        },
      ],
      'jest/no-disabled-tests': 'error',
      'jest/no-commented-out-tests': 'error',
      'jest/no-conditional-expect': 'error',
      'jest/expect-expect': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-each': 'error',
      'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
      'jest/max-expects': [
        'error',
        {
          max: 20,
        },
      ],
      'max-lines-per-function': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  prettierRecommended,
)
