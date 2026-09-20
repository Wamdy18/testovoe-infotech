<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h5">Авторы</h1>
      <v-spacer />
      <v-chip variant="tonal" class="mr-2">
        Всего: {{ authors.length }}
      </v-chip>
      <v-btn
        v-role="'administrator'"
        color="primary"
        prepend-icon="mdi-plus"
        @click="openCreate"
      >
        Создать автора
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="author in authors"
        :key="author.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="h-100 text-center pa-4 d-flex flex-column" hover>
          <v-avatar size="120" class="mb-3 mx-auto">
            <v-img :src="author.photo" cover />
          </v-avatar>
          <v-card-title class="text-body-1">
            {{ author.fullName }}
          </v-card-title>
          <v-card-subtitle>ID: {{ author.id }}</v-card-subtitle>

          <v-spacer />

          <v-card-actions v-role="'administrator'" class="justify-center">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="openEdit(author)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="openDelete(author)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- CREATE / EDIT DIALOG -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card>
        <v-card-title>
          {{ editAuthor ? 'Редактировать автора' : 'Создать автора' }}
        </v-card-title>

        <v-card-text>
          <v-form v-model="isFormValid" @submit.prevent="save">
            <v-text-field
              v-model="form.fullName"
              label="ФИО"
              :rules="[rules.required]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" :disabled="!isFormValid" @click="save">
            {{ editAuthor ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DELETE CONFIRMATION -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card>
        <v-card-title>Удалить автора?</v-card-title>
        <v-card-text>
          «{{ authorToDelete?.fullName }}» будет удалён.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthorsStore } from '@/stores/authors'

const authorsStore = useAuthorsStore()
const { authors } = storeToRefs(authorsStore)

const dialog = ref(false)
const deleteDialog = ref(false)
const editAuthor = ref(null)
const authorToDelete = ref(null)
const isFormValid = ref(false)

const form = reactive({ fullName: '' })

const rules = {
  required: (v) => !!v || 'Обязательное поле',
}

function openCreate() {
  editAuthor.value = null
  form.fullName = ''
  dialog.value = true
}

function openEdit(author) {
  editAuthor.value = author
  form.fullName = author.fullName
  dialog.value = true
}

function save() {
  if (!isFormValid.value) return

  if (editAuthor.value) {
    authorsStore.update(editAuthor.value.id, { fullName: form.fullName })
  } else {
    authorsStore.create({ fullName: form.fullName })
  }
  dialog.value = false
}

function openDelete(author) {
  authorToDelete.value = author
  deleteDialog.value = true
}

function confirmDelete() {
  authorsStore.remove(authorToDelete.value.id)
  deleteDialog.value = false
  authorToDelete.value = null
}
</script>
