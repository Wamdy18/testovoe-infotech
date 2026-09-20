<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h5">Топ авторов по количеству книг</h1>
      <v-spacer />
      <v-select
        v-model="selectedYear"
        :items="YEARS"
        label="Год"
        density="comfortable"
        variant="outlined"
        hide-details
        style="max-width: 160px"
      />
    </div>

    <v-card>
      <v-list lines="two">
        <v-list-item
          v-for="(author, index) in topAuthors"
          :key="author.id"
        >
          <template #prepend>
            <div class="d-flex align-center">
              <span class="text-h6 font-weight-bold mr-4" style="width: 2rem">
                {{ index + 1 }}
              </span>
              <v-avatar size="48">
                <v-img :src="author.photo" cover />
              </v-avatar>
            </div>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ author.fullName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Книг за {{ selectedYear }}: {{ author.count }}
          </v-list-item-subtitle>

          <template #append>
            <v-chip color="primary" variant="tonal">
              {{ author.count }}
            </v-chip>
          </template>
        </v-list-item>

        <v-list-item v-if="topAuthors.length === 0">
          <v-list-item-title>Нет данных за {{ selectedYear }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { books, YEARS } from '@/data/books'
import { authors } from '@/data/authors'

const selectedYear = ref(2020)

const topAuthors = computed(() => {
  // 1. Фильтруем книги по году
  const forYear = books.filter((b) => b.year === selectedYear.value)

  // 2. Считаем количество книг для каждого автора
  const countByAuthor = forYear.reduce((acc, book) => {
    acc[book.authorId] = (acc[book.authorId] || 0) + 1
    return acc
  }, {})

  // 3. Собираем с данными автора и сортируем
  return Object.entries(countByAuthor)
    .map(([authorId, count]) => {
      const author = authors.find((a) => a.id === Number(authorId))
      return { ...author, count }
    })
    .filter((a) => a.id) // на случай "висячих" id
    .sort((a, b) => b.count - a.count || a.fullName.localeCompare(b.fullName))
    .slice(0, 10)
})
</script>
