<template>
  <v-app>
    <v-app-bar color="primary" v-if="auth.isAuthenticated && !route.meta.guestOnly">
      <v-app-bar-title>BestBooks</v-app-bar-title>

      <v-tabs class="d-none d-md-flex">
        <v-tab to="/main" prepend-icon="mdi-book">Книги</v-tab>
        <v-tab to="/authors" prepend-icon="mdi-account">Авторы</v-tab>
        <v-tab to="/report" prepend-icon="mdi-chart-bar">Отчёт</v-tab>
      </v-tabs>

      <!-- На мобильных — только иконки -->
      <v-btn-group class="d-md-none" variant="text">
        <v-btn to="/main" icon="mdi-book" />
        <v-btn to="/authors" icon="mdi-account" />
        <v-btn to="/report" icon="mdi-chart-bar" />
      </v-btn-group>

      <v-spacer />

      <v-chip class="mr-2" variant="tonal" color="white">
        {{ auth.user?.name }} ({{ auth.role }})
      </v-chip>
      <v-btn icon="mdi-logout" @click="handleLogout" />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
