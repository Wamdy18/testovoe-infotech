import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// Закомментировано, оставлено для демонстрации работы с api.
// import api from '@/services/api'

// ─────────────────────────────────────────────────────────────
// MOCK-данные (для демонстрации без бэкенда)
// ─────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    token: 'mock-admin-token',
    user: { id: 1, name: 'Администратор', role: 'administrator' },
  },
  {
    email: 'guest@demo.com',
    password: 'guest123',
    token: 'mock-guest-token',
    user: { id: 2, name: 'Гость', role: 'guest' },
  },
]

const STORAGE_KEY = 'auth'

export const useAuthStore = defineStore('auth', () => {
  // Восстанавливаем сессию из localStorage при старте
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  const user = ref(saved?.user || null)
  const token = ref(saved?.token || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'administrator')
  const isGuest = computed(() => user.value?.role === 'guest')
  const role = computed(() => user.value?.role || null)

  // ───────────────────────────────────────────────────────────
  // MOCK-РЕАЛИЗАЦИЯ (для демонстрации без бэка)
  // ───────────────────────────────────────────────────────────
  async function login(credentials) {
    // Имитация задержки сети
    await new Promise((r) => setTimeout(r, 600))

    const found = MOCK_USERS.find(
      (u) =>
        u.email === credentials.email &&
        u.password === credentials.password
    )

    if (!found) {
      throw {
        response: { data: { message: 'Неверный email или пароль' } },
      }
    }

    token.value = found.token
    user.value = found.user

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: found.token, user: found.user })
    )
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // ───────────────────────────────────────────────────────────
  // ПРОД-РЕАЛИЗАЦИЯ (закомментирована, оставлена для демонстрации)
  // ───────────────────────────────────────────────────────────
  /*
  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    token.value = data.token
    user.value = data.user
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: data.token,
      user: data.user,
    }))
  }

  function logout() {
    // Опционально: дернуть /auth/logout для инвалидации refresh-токена
    // api.post('/auth/logout').catch(() => {})
    token.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }
  */

  return {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    isGuest,
    login,
    logout,
  }
})













// ПЕРВАЯ РЕАЛИЗАЦИЯ
// export const useAuthStore = defineStore('auth', () => {
//   const user = ref(null)
//   const token = ref(localStorage.getItem('token') || null)

//   const isAuthenticated = computed(() => !!token.value)

//   async function login(credentials) {
//     const { data } = await api.post('/auth/login', credentials)
//     token.value = data.token
//     user.value = data.user
//     localStorage.setItem('token', data.token)
//   }

//   function logout() {
//     token.value = null
//     user.value = null
//     localStorage.removeItem('token')
//   }

//   return { user, token, isAuthenticated, login, logout }
// })
