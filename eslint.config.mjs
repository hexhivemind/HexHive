// /* eslint-disable sort-keys */
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      //'sort-keys': ['warn', 'asc', { caseSensitive: false, natural: true }],
    },
  },
);
