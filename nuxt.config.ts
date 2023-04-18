// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
      // Public keys that are exposed to the client
      public: {
        firebaseConfig: {
            apiKey: process.env.NUXT_PUBLIC_FIREBASE_APIKEY,
            authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTHDOMAIN,
            databaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASEURL,
            projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECTID,
            storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGEBUCKET,
            messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
            appId: process.env.NUXT_PUBLIC_FIREBASE_APPID,
        }
      }
    }
})
