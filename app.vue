<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
  const nuxtApp = useNuxtApp()

  console.log(nuxtApp.$auth)
</script>