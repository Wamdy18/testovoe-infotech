import { defineStore } from 'pinia'
import { ref } from 'vue'
import { books as initialBooks, BOOK_PLACEHOLDER } from '@/data/books'

// для использования API
import { booksApi } from '@/services/books.api'


export const useBooksStore = defineStore('books', () => {
  // для использования API
  const isLoading = ref(false)
  const error = ref(null)
  const items = ref([])
  const pagination = ref({
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 1,
  })

  async function fetchList() {
    isLoading.value = true
    error.value = null

    try {
      const res = await booksApi.list({
        page: pagination.value.page,
        perPage: pagination.value.per_page,
      })

      items.value = res.data.items
      pagination.value = res.data.pagination
    } catch (e) {
      error.value =
        e.response?.data?.errors?.[0]?.message || 'Не удалось загрузить книги'
    } finally {
      isLoading.value = false
    }
  }
  function setPage(page) {
    pagination.value.page = page
    return fetchList()
  }
  // ─── CRUD ──────────────────────────────────────
  async function createWithApi(payload) {
    const res = await booksApi.create(payload)
    // Новая книга — на первую страницу, где она точно видна
    pagination.value.page = 1
    await fetchList()
    return res.data
  }

  async function updateWithApi(id, payload) {
    const res = await booksApi.patch(id, payload)
    await fetchList() // перечитываем текущую страницу
    return res.data
  }

  async function removeWithApi(id) {
    await booksApi.remove(id)
    // Edge-case: удалили последний элемент на не-первой странице
    if (items.value.length === 1 && pagination.value.page > 1) {
      pagination.value.page -= 1
    }
    await fetchList()
  }

  // ─── Сброс (при logout) ────────────────────────
  function resetWithApi() {
    items.value = []
    pagination.value = { total: 0, page: 1, per_page: 12, total_pages: 1 }
    error.value = null
  }

  //

  // Без API

  // Копируем seed — чтобы не мутировать исходный массив
  const books = ref(
    initialBooks.map((b) => ({ ...b, image: BOOK_PLACEHOLDER }))
  )

  function create(payload) {
    const nextId = books.value.length
      ? Math.max(...books.value.map((b) => b.id)) + 1
      : 1
    const book = { id: nextId, image: BOOK_PLACEHOLDER, ...payload }
    books.value.unshift(book) // в начало — чтобы сразу увидеть
    return book
  }

  function update(id, payload) {
    const book = books.value.find((b) => b.id === id)
    if (book) Object.assign(book, payload)
  }

  function remove(id) {
    books.value = books.value.filter((b) => b.id !== id)
  }

  return { items, pagination,
    isLoading, error,
    fetchList, setPage,
    createWithApi, updateWithApi,
    removeWithApi, resetWithApi,
    books, create, update, remove
  }
})
