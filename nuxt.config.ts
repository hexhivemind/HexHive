// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@pinia/nuxt',
    '@nuxt/test-utils',
  ],
  app: {
    head: {
      title: 'HexHive',
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  typescript: {
    typeCheck: true,
  },
  css: ['~/assets/scss/fonts.scss'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  // See: https://nuxtseo.com/docs/sitemap/getting-started/installation
  site: {
    url: 'https://example.com',
    name: 'My Awesome Website',
  },
  // See: https://nuxtseo.com/docs/robots/getting-started/installation
  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
  },
});
