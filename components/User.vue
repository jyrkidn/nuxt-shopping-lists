<template>
    <div>
        <div v-if="user" class="text-sm">
            Hello, {{ user.email }}
            <button type="button" @click="doSignOut" class="underline">
                Sign Out
            </button>
        </div>
        <div v-else>
            <NuxtLink to="/login">Login</NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { signOut } from "firebase/auth"

const router = useRouter()
const route = useRoute()
const user = useCurrentUser()
const auth = useFirebaseAuth()

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in and has a redirect query
      router.push(route.query.redirect)
    }  else if (user) {
      // user logged in
      router.push('/')
    }
  })
})

const doSignOut = () => {
    signOut(auth)
}
</script>