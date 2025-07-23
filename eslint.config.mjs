import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,
  {
    ignores: ['.next/*', 'node_modules/*', 'dist/*', 'build/*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        React: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-empty': 'warn',
      'no-debugger': 'warn',
      'no-console': 'off',
    },
  },
];
