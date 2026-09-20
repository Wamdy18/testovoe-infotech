import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authors as initialAuthors, AUTHOR_PLACEHOLDER } from '@/data/authors'

export const useAuthorsStore = defineStore('authors', () => {
  const authors = ref(
    initialAuthors.map((a) => ({ ...a, photo: AUTHOR_PLACEHOLDER }))
  )

  function create(payload) {
    const nextId = authors.value.length
      ? Math.max(...authors.value.map((a) => a.id)) + 1
      : 1
    const author = { id: nextId, photo: AUTHOR_PLACEHOLDER, ...payload }
    authors.value.unshift(author)
    return author
  }

  function update(id, payload) {
    const author = authors.value.find((a) => a.id === id)
    if (author) Object.assign(author, payload)
  }

  function remove(id) {
    authors.value = authors.value.filter((a) => a.id !== id)
  }

  return { authors, create, update, remove }
})
