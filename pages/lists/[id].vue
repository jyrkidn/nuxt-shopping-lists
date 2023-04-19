<template>
    <div>
        List {{  $route.params.id }}
    </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
// When accessing /posts/1, route.params.id will be 1
console.log(route.params.id)
</script>
