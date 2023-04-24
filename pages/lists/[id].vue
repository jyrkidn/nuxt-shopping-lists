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
        >
          <template #item="{ element }">
            <div class="draggable flex my-2 items-center w-full" :key="element.id">
              <span class="sort-handle cursor-move p-2">
                ::
              </span>
              <input
                type="checkbox"
                class="appearance-none checked:bg-blue-500 h-5 w-5 border-2 rounded-full p-2"
                @change="toggleIsBought(element.id, element.is_bought)"
                :checked="element.is_bought"
              />

              <input
                type="text"
                :value="element.name"
                :class="{ 'line-through': element.is_bought }"
                @change="updateItemName(element.id, $event.target.value)"
                class="outline-none grow bg-transparent border-0 p-2"
              />

              <button class="p-2" type="button" @click="deleteItem(element.id)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>

              </button>
            </div>
          </template>
        </Sortable>
      </div>
  </div>
</template>

<script setup>
import { useDocument } from 'vuefire'
import { collection, doc, updateDoc, addDoc, orderBy, query, writeBatch } from 'firebase/firestore'
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
const items = useCollection(query(itemsRef, orderBy("sort_order", "desc")))

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
/* @TODO: replace with tailwind */
.ghost {
  @apply opacity-50 bg-red-50 border-solid border border-red-400;
}
.drag {
  @apply bg-red-100;
}
</style>