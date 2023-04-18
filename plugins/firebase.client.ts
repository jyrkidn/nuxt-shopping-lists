import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const app = initializeApp(config.firebaseConfig)

    const auth = getAuth(app)
    // Initialize Realtime Database and get a reference to the service
    const database = getFirestore(app)

    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    nuxtApp.vueApp.provide('database', database)
    nuxtApp.provide('database', database)
})