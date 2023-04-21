<template>
  <main class="px-5 py-5">
    <nav class="flex">
      <a href="/">
        <h1 class="text-3xl mb-6">Lists</h1>
      </a>

      <div v-if="user">
        Hello, {{ user.email }}
        <button type="button" @click="doSignOut">
          Sign Out
        </button>
      </div>
      <div v-else>
        <NuxtLink to="/login">Login</NuxtLink>
      </div>

    </nav>

    <div>
        {{  error.message }}
    </div>
  </main>
</template>

<script setup>
import { signOut } from "firebase/auth"

const user = useCurrentUser()
const auth = useFirebaseAuth()

defineProps({
  'error': {
    type: Object,
    required: true
  }
})

useHead({
  title: 'Shopping List',
  htmlAttrs: {
    class: 'bg-red-50'
  }
})

const doSignOut = () => {
    signOut(auth)
}
</script>
