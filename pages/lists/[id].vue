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
          :options="{
            handle: '.sort-handle'
          }"
        >
          <template #item="{ element }">
            <div class="draggable flex my-2 items-center w-full" :key="element.id">
              <span class="sort-handle cursor-move">
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
            </div>
          </template>
        </Sortable>
        <!-- <li
            v-for="(item, index) in items"
            class="flex my-2 items-center w-full"
            :key="index"
        >
            <input
                type="checkbox"
                class="appearance-none checked:bg-blue-500 h-5 w-5 border-2 rounded-full p-2"
                @change="toggleIsBought(item.id, item.is_bought)"
                :checked="item.is_bought"
            />

            <input
                type="text"
                :value="item.name"
                :class="{ 'line-through': item.is_bought }"
                @change="updateItemName(item.id, $event.target.value)"
                class="outline-none grow bg-transparent border-0 p-2"
            />
            <button class="p-2" type="button" @click="removeItem(index, element.name)">
                <TrashIcon class="h-5 w-5" />
            </button>
          </li> -->
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
  let start = event.oldIndex
  let end = event.newIndex + 1

  // get all items before newIndex and update those with new sort_order
  if (event.oldIndex > event.newIndex) {
    start = event.newIndex
    end = event.oldIndex + 1
  }

  const itemsToUpdate = items.value.slice(start, end)

  const batch = writeBatch(firestore)

  itemsToUpdate.forEach(async (item, index) => {
    // batch.update(doc(itemsRef, item.id), {sort_order: "New York City"});
    console.log({ current: item.sort_order, new: itemsToUpdate })
  })

  await batch.commit();
}
</script>
