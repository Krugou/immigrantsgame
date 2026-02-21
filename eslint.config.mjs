import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import checkFile from 'eslint-plugin-check-file';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Base project rules
  {
    plugins: {
      'check-file': checkFile,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Best-practice rules
      'consistent-return': 'error',
      'no-implicit-coercion': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
      complexity: ['warn', { max: 12 }],
      'no-empty-function': 'warn',
      'prefer-template': 'error',
      'no-prototype-builtins': 'error',
      'no-duplicate-imports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
      'arrow-body-style': ['error', 'as-needed'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'all'],
      'no-console': 'warn',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // always keep an empty line between successive function declarations
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'function', next: 'function' },
        { blankLine: 'always', prev: 'function', next: 'multiline-block-like' },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/components/**/*.{jsx,tsx}': 'PASCAL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  // Backend-specific overrides (Node/Express)
  {
    files: ['backend/**'],
    languageOptions: {
      parserOptions: {
        // Avoid using project service for backend helper scripts
        projectService: false,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      parser: '@typescript-eslint/parser',
    },
    env: {
      node: true,
      es2021: true,
    },
    rules: {
      // Backend code (Express) commonly uses function declarations and console logs
      'func-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-console': 'off',
      'no-param-reassign': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Enforce scripts to be authored in TypeScript, not JS
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'Script files must be TypeScript (.ts/.mts). Convert this file to TypeScript and update package.json scripts to call `tsx` or `node --loader tsx`.',
        },
      ],
    },
  },
  // Global ignore patterns
  {
    ignores: [
      '.next/**',
      'public/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'legacy_flutter/**',
      'backend/**',
      'scripts/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'eslint.config.mjs',
    ],
  },
]);

export default eslintConfig;
