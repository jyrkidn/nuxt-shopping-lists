<template>
    <div>
      <div class="mt-2 w-full" v-if="list">
        <input
            id="title"
            type="text"
            placeholder="Title"
            :value="list.title"
            class="w-full p-3 rounded-lg"
            @change="updateTitle($event.target.value)"
          />
      </div>
      <div class="w-full" v-if="items">
        <div class="flex my-2 items-center w-full">
          <form @submit.prevent="addItem">
            <input
              type="text"
              v-model="state.newItemName"
              class="outline-none grow bg-transparent border-0 p-2"
              placeholder="+ add item"
            />
          </form>
        </div>
        <Sortable
          :list="items"
          item-key="id"
          tag="div"
          @end="sorting"
          :options="sortableOptions"
          class="divide-y divide-red-100"
        >
          <template #item="{ element }">
            <div class="draggable flex py-2 items-center w-full" :key="element.id">
              <span class="sort-handle cursor-move p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </span>

              <input
                type="text"
                :value="element.name"
                :class="{ 'line-through': element.is_bought }"
                @change="updateItemName(element.id, $event.target.value)"
                class="outline-none grow bg-transparent border-0 p-2"
              />

              <input
                type="checkbox"
                class="appearance-none checked:bg-blue-500 h-5 w-5 border-2 rounded-full p-2"
                @change="toggleIsBought(element.id, element.is_bought)"
                :checked="element.is_bought"
              />

            </div>
          </template>
        </Sortable>
      </div>
  </div>
</template>

<script setup>
import { useDocument } from 'vuefire'
import { collection, doc, updateDoc, addDoc, orderBy, where, query, writeBatch } from 'firebase/firestore'
import { Sortable } from 'sortablejs-vue3'

const state = reactive({ newItemName: '' })

definePageMeta({
  middleware: ['auth'],
})

const sortableOptions = {
  handle: '.sort-handle',
  animation: 150,
  ghostClass: "ghost",
  dragClass: "drag",
  scroll: true,
  forceFallback: true,
  scrollSensitivity: 50,
  scrollSpeed: 10,
  bubbleScroll: true,
}

const route = useRoute()

const firestore = useFirestore()

const listRef = doc(collection(firestore, 'lists'), route.params.id)

if (! listRef.id) {
  throw createError({
    statusCode: 404,
    statusMessage: 'List not found'
  })
}

const listSource = computed(
  () => listRef
)
const list = useDocument(listSource)

watch(list, async (newList, oldList) => {
  if (! newList) {
    throw createError({
      statusCode: 404,
      statusMessage: 'List not found',
      fatal: true
    })
  }
})

const itemsRef = collection(firestore, 'lists', route.params.id, 'items')
const items = useCollection(query(itemsRef, where("is_bought", "==", false), orderBy("sort_order", "desc")))

const updateTitle = async (title) => {
  await updateDoc(listRef, {
    title: title
  })
}

const addItem = async () => {
  await addDoc(itemsRef, {
    name: state.newItemName,
    is_bought: false,
    sort_order: items.value.length + 1
  });

  state.newItemName = ''
}

const updateItemName = async (id, name) => {
  await updateDoc(doc(itemsRef, id), {
      name: name
  });
}

const toggleIsBought = async (id, currentValue) => {
  await updateDoc(doc(itemsRef, id), {
      is_bought: ! currentValue
  });
}

const sorting = async (event) => {
  const itemsToUpdate = [...items.value]

  const item = itemsToUpdate.splice(event.oldIndex, 1)[0]

  itemsToUpdate
    .splice(event.newIndex, 0, item)

  const batch = writeBatch(firestore)

  itemsToUpdate.map((item, index) => {
      const itemRef = doc(firestore, 'lists', route.params.id, 'items', item.id)
      batch.update(itemRef, {"sort_order": itemsToUpdate.length - index})
    })

  await batch.commit();
}
</script>

<style>
.ghost {
  @apply opacity-50 bg-red-50 border-solid border border-red-400;
}
.drag {
  @apply bg-red-100;
}
</style>