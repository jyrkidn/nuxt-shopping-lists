import { defineStore } from 'pinia'

export const useListStore = defineStore('list', {
  state: () => ({
    title: '',
    items: []
  }),
  getters: {},
  actions: {
    updateTitle(title) {
      this.title = title
    },
    updateItemName(key, name) {
      this.items[key].name = name
    },
    updateItemState(key, isBought) {
      this.items[key].is_bought = isBought
    },
  },

})
