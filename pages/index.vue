<template>
    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg flex justify-between" v-for="list in lists" :key="list.id">
            <NuxtLink :to="`/lists/${list.id}`" class="grow block p-3 flex items-center">
                <span>{{ list.title }}</span>
                <span class="text-slate-400 text-xs ml-2">{{ list.items.length }}</span>
            </NuxtLink>
        </div>
        <NuxtLink to="/lists/create" class="bg-white block p-3 rounded-lg">
			+ Add
		</NuxtLink>
    </div>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'

definePageMeta({
  middleware: ['auth'],
})

const firestore = useFirestore()

const lists = useCollection(collection(firestore, 'lists'))
</script>