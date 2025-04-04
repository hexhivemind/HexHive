import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ href: '/favicon.ico', rel: 'icon', type: 'image/x-icon' }],
      title: 'HexHive',
    },
    layoutTransition: { mode: 'out-in', name: 'layout' },
    pageTransition: { mode: 'out-in', name: 'page' },
  },

  auth: {
    atproto: true,
    webAuthn: true,
  },

  compatibilityDate: '2024-11-01',

  css: ['~/assets/scss/fonts.scss', '~/assets/css/tailwind.css'],

  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@pinia/nuxt',
    '@nuxt/test-utils',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@vee-validate/nuxt',
    'shadcn-nuxt',
    './modules/runtime-types.codegen.ts',
  ],

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  // See: https://nuxtseo.com/docs/robots/getting-started/installation
  robots: {
    blockAiBots: true,
    blockNonSeoBots: true,
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/shadcn',
  },

  // See: https://nuxtseo.com/docs/sitemap/getting-started/installation
  site: {
    name: 'My Awesome Website',
    url: 'https://example.com',
  },

  typescript: {
    typeCheck: true,
  },

  vite: {
    plugins: [tailwindcss() as never], // Type mismatch, but irrelevant I think?
  },
});
