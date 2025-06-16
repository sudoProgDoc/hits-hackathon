/** @type {import('eslint').Linter.FlatConfig} */
const config = [
  {
    ignores: ['node_modules/**', 'build/**'],
  },
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'import/prefer-default-export': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
    plugins: {
      react: 'plugin:react/recommended',
      'jsx-a11y': 'plugin:jsx-a11y/recommended',
      'import': 'plugin:import/errors',
    },
  },
];

export default config;
