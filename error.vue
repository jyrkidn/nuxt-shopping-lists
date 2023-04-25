<template>
  <main class="px-5 py-5">
    <Header />

    <div>
        {{  error.message }}
    </div>
  </main>
</template>

<script setup>
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
</script>
