import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-unused-expressions': 'error',
            'linebreak-style': ['error', 'windows'],
            'quotes': ['error', 'single'],
            'semi': 'error',
            'camelcase': 'off',
            'no-duplicate-imports': ['error', { 'includeExports': true }],
            'no-console': 'warn',
            'no-var': 'error',
            'no-alert': 'warn',
            'no-empty': 'error',
            'no-empty-function': 'error',
            'no-trailing-spaces': ['error', { 'skipBlankLines': false }],
            'semi-spacing': 'error',
            'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0, 'maxEOF': 1 }],
            'indent': 'error',
            'block-spacing': 'error',
            'space-before-function-paren': ['error', 'never'],
            'jsx-quotes': ['error', 'prefer-double'],
            'comma-dangle': ['error', 'always-multiline'],
            'keyword-spacing': ['error', { 'before': true, 'after': true }],
            'class-methods-use-this': 'off',
        },
    },
];