// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    // ... other modules
    'nuxt-vuefire',
  ],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Public keys that are exposed to the client
  vuefire: {
    auth: true,
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_APIKEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASEURL,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECTID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APPID,
    }
  }
})
