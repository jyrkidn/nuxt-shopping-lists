<template>
  <div>
    <main class="px-5 py-5">
			<nav class="flex">
				<a href="/">
					<h1 class="text-3xl mb-6">Lists</h1>
				</a>

				<User />
			</nav>

      <NuxtPage />
		</main>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

useHead({
  title: 'Shopping List',
  htmlAttrs: {
    class: 'bg-red-50'
  }
})

// we don't need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in
      router.push(route.query.redirect)
    }
  })
})
</script>