// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import vue from 'eslint-plugin-vue';
import { vueTsConfigs } from '@vue/eslint-config-typescript';
import prettier from '@vue/eslint-config-prettier';
import vuetify from 'eslint-plugin-vuetify';

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

  vue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,
  vuetify,

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

  prettier,
);
