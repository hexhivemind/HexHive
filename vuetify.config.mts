import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration';
import { md3 } from 'vuetify/blueprints';

export default defineVuetifyConfiguration({
  /* vuetify options */
  theme: {
    defaultTheme: 'dark',
  },
  blueprint: md3,
});
