
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
    {
        plugins: {
            vue,
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: (await import('vue-eslint-parser')).default,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            'no-underscore-dangle': 'off',
            'vue/valid-v-slot': 'off',
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'max-len': ['warn', { code: 200, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
            indent: 'off',
            'vue/require-explicit-emits': 'warn',
            'vue/no-v-html': 'warn',
            'vue/attribute-hyphenation': ['error', 'always'],
            'vue/no-v-text-v-html-on-component': 'warn',
            'vue/html-self-closing': ['error', {
                'html': {
                    'void': 'always',
                    'normal': 'always',
                    'component': 'always'
                },
                'svg': 'always',
                'math': 'always'
            }],
            'vue/multi-word-component-names': 'off',
            'vue/v-on-event-hyphenation': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-dynamic-delete': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/no-use-v-if-with-v-for': 'warn',
        },
    },
];
