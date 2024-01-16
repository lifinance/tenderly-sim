module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-negated-condition': 'error',
    'unused-imports/no-unused-imports': 'error',
    'local-rules/no-native-error-throw': 'error',
    'no-console': 'error',
    'no-return-await': 'error',
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
    'deprecation/deprecation': 'warn',
    'neverthrow/must-use-result': 'error',
    'no-implicit-any-catch': 'error',
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
    complexity: [
      'error',
      {
        max: 5,
      },
    ],
    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
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
        devDependencies: [
          '**/*.spec.ts',
          '**/globalSetup.ts',
          '**/globalTeardown.ts',
        ],
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
    'import/no-unassigned-import': [
      'error',
      {
        allow: ['FastifyAugmentation/fastify.request.types'],
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-restricted-paths': ['error'],
    'import/no-unused-modules': [
      'error',
      {
        unusedExports: true,
      },
    ],
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
    'prettier/prettier': 'error',
  },
  plugins: [
    'local-rules',
    '@typescript-eslint',
    'deprecation',
    'import',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  overrides: [

    {
      // tests can have longer files/lines
      files: ['src/**/*.spec.ts'],
      rules: {
        'max-lines-per-function': [
          'error',
          {
            max: 500, // describe blocks are a single function, we don't care about length, we mainly need to overwrite the rule above
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
    {
      files: ['.eslintrc.js'],
      rules: {
        'filenames/match-regex': 'off',
        'import/no-commonjs': 'off',
        'import/unambiguous': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    {
      files: ['*.config.ts'],
      rules: {
        'filenames/match-exported': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/unambiguous': 'off',
      },
    },
    {
      files: ['*.spec.ts'],
      plugins: ['jest', 'jest-formatting'],
      extends: ['plugin:jest/recommended', 'plugin:jest-formatting/strict'],
      rules: {
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
      },
    },
  ],
}
