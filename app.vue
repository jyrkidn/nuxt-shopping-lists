<template>
  <main class="px-5 py-5">
    <Header />

    <NuxtPage />
  </main>
</template>

<script setup>
useHead({
  title: 'Shopping List',
  htmlAttrs: {
    class: 'bg-red-50'
  }
})
</script>