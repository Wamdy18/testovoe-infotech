<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h5">Книги</h1>
      <v-spacer />
      <v-chip variant="tonal" class="mr-2">
        Всего: {{ books.length }}
      </v-chip>
      <v-btn
        v-role="'administrator'"
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreate"
      >
        Создать книгу
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="book in paginatedBooks"
        :key="book.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="h-100 d-flex flex-column" hover>
          <v-img :src="book.image" height="240" cover class="bg-grey-lighten-2" />

          <v-card-title class="text-body-1 font-weight-bold">
            {{ book.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ book.year }} · ISBN: {{ book.isbn }}
          </v-card-subtitle>

          <v-card-subtitle class="text-caption text-medium-emphasis">
            <v-icon size="14" class="mr-1">mdi-account</v-icon>
            {{ authorName(book.authorId) }}
          </v-card-subtitle>

          <v-card-text class="text-body-2 flex-grow-1">
            {{ book.description }}
          </v-card-text>

          <v-card-actions v-role="'administrator'">
            <v-spacer />
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEdit(book)" />
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="openDelete(book)" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-center mt-6">
      <v-pagination
        v-model="page"
        :length="pageCount"
        :total-visible="5"
        rounded
      />
    </div>

    <!-- create, edit -->
    <v-dialog v-model="dialog" max-width="560" :persistent="isSaving">
      <v-card>
        <v-card-title>
          {{ editBook ? 'Редактировать книгу' : 'Создать книгу' }}
        </v-card-title>

        <v-card-text>
          <v-form v-model="isFormValid" @submit.prevent="save">
            <v-text-field
              v-model="form.title"
              label="Название"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-select
              v-model="form.authorId"
              :items="authorItems"
              item-title="fullName"
              item-value="id"
              label="Автор"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model.number="form.year"
              label="Год выпуска"
              type="number"
              :rules="[rules.required, rules.year]"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="form.isbn"
              label="ISBN"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-2"
            />
            <v-textarea
              v-model="form.description"
              label="Описание"
              :rules="[rules.required]"
              variant="outlined"
              rows="3"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false" :disabled="isSaving">Отмена</v-btn>
          <v-btn color="primary" :loading="isSaving" :disabled="!isFormValid" @click="save">
            {{ editBook ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- delete -->
    <v-dialog v-model="deleteDialog" max-width="420" :persistent="isSaving">
      <v-card>
        <v-card-title>Удалить книгу?</v-card-title>
        <v-card-text>
          «{{ bookToDelete?.title }}» будет удалена.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false" :disabled="isSaving">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="isSaving">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="2500"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBooksStore } from '@/stores/books'
import { useAuthorsStore } from '@/stores/authors'

const booksStore = useBooksStore()
const { books } = storeToRefs(booksStore)
const authorsStore = useAuthorsStore()
const { authors } = storeToRefs(authorsStore)

// пагинация
const page = ref(1)
const perPage = 12
const pageCount = computed(() => Math.ceil(books.value.length / perPage))
const paginatedBooks = computed(() => {
  const start = (page.value - 1) * perPage
  return books.value.slice(start, start + perPage)
})

const dialog = ref(false)
const deleteDialog = ref(false)
const editBook = ref(null)
const bookToDelete = ref(null)
const isFormValid = ref(false)
const isSaving = ref(false)

const form = reactive({
  title: '',
  authorId: null,
  year: new Date().getFullYear(),
  isbn: '',
  description: '',
})

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
})

function showSnackbar(text, color = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

const authorItems = computed(() => authors.value)

// хелперы
function authorName(id) {
  return authors.value.find((a) => a.id === id)?.fullName ?? 'Автор не указан'
}

// валидация
const rules = {
  required: (v) => !!v || 'Обязательное поле',
  year: (v) =>
    (v >= 1000 && v <= new Date().getFullYear()) || 'Некорректный год',
}

// для API
onMounted(() => {
  // booksStore.fetchList()
  // if (authors.value.length === 0) {
  //   authorsStore.fetchList()
  // }
})

// function onPageChange(page) {
//   booksStore.setPage(page)
// }

async function saveWithApi() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    if (editBook.value) {
      await booksStore.update(editBook.value.id, { ...form })
      showSnackbar('Книга обновлена', 'success')
    } else {
      await booksStore.create({ ...form })
      showSnackbar('Книга создана', 'success')
    }
    dialog.value = false
  } catch (e) {
    const msg = e.response?.data?.errors?.[0]?.message || 'Не удалось сохранить'
    showSnackbar(msg, 'error')
  } finally {
    isSaving.value = false
  }
}

async function confirmDeleteWithApi() {
  isSaving.value = true
  try {
    await booksStore.remove(bookToDelete.value.id)
    showSnackbar('Книга удалена', 'success')
  } catch (e) {
    const msg = e.response?.data?.errors?.[0]?.message || 'Не удалось сохранить'
    showSnackbar(msg, 'error')
  } finally {
    isSaving.value = false
    deleteDialog.value = false
    bookToDelete.value = null
  }
}
//

// при удалении последнего элемента возвращаемся на предыдущую
watch(pageCount, (val) => {
  if (val > 0 && page.value > val) page.value = val
})

function resetForm() {
  Object.assign(form, {
    title: '',
    authorId: null,
    year: new Date().getFullYear(),
    isbn: '',
    description: '',
  })
}

function openCreate() {
  editBook.value = null
  resetForm()
  form.authorId = authors.value[0]?.id ?? null
  dialog.value = true
}

function openEdit(book) {
  editBook.value = book
  Object.assign(form, {
    title: book.title,
    authorId: book.authorId,
    year: book.year,
    isbn: book.isbn,
    description: book.description,
  })
  dialog.value = true
}

// имитация задержки
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function save() {
  isSaving.value = true;
  await delay(800)
  if (!isFormValid.value) return

  if (editBook.value) {
    booksStore.update(editBook.value.id, { ...form })

    showSnackbar('Книга обновлена', 'success')
    isSaving.value = false
  } else {
    booksStore.create({ ...form })
    showSnackbar('Книга создана', 'success')
    page.value = 1
    isSaving.value = false
  }
  dialog.value = false
  isSaving.value = false
}

function openDelete(book) {
  bookToDelete.value = book
  deleteDialog.value = true
}

async function confirmDelete() {
  isSaving.value = true
  await delay(800)
  booksStore.remove(bookToDelete.value.id)
  showSnackbar('Книга удалена', 'success')
  deleteDialog.value = false
  bookToDelete.value = null
  isSaving.value = false
}
</script>
