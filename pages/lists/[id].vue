<template>
    <div>
        <div v-if="list">
          {{  list.title }}
        </div>
    </div>
</template>

<script setup>
import { useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()

const firestore = useFirestore()

const listSource = computed(
  () => doc(collection(firestore, 'lists'), route.params.id)
)

const list = useDocument(listSource)
</script>
