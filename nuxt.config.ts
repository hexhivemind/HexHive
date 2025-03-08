// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  typescript: {
    typeCheck: true,
  },
  site: {
    url: 'https://example.com',
    name: 'My Awesome Website',
  },
  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
  },
});
