<template>
    <div>
      <div class="mt-2 w-full">
        <input
            id="title"
            type="text"
            placeholder="Title"
            value=""
            class="w-full p-3 rounded-lg"
            @change="createTitle($event.target.value)"
          />
      </div>
  </div>
</template>

<script setup>
import { useDocument } from 'vuefire'
import { collection, doc, updateDoc, addDoc, orderBy, where, query, writeBatch } from 'firebase/firestore'

definePageMeta({
  middleware: ['auth'],
})

const firestore = useFirestore()

const itemsRef = collection(firestore, 'lists')

const createTitle = async (title) => {
  const data = await addDoc(itemsRef, {
    title: title
  })

  return navigateTo(`/lists/${data.id}`)
}
</script>
