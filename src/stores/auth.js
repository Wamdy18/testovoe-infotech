import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// для API
import api from '@/services/api'
import {authApi} from '@/services/auth.api'

// без API
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
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
  const user = ref(saved?.user || null)
  const token = ref(saved?.token || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'administrator')
  const isGuest = computed(() => user.value?.role === 'guest')
  const role = computed(() => user.value?.role || null)

  // без API
  async function login(credentials) {
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
 //

  // c API
  async function loginWithApi(credentials) {
    const { data } = await authApi.login(credentials)
    token.value = data.token
    user.value = data.user
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: data.token,
      user: data.user,
    }))
  }
  //

  return {
    user,
    token,
    role,
    isAuthenticated,
    isAdmin,
    isGuest,
    login,
    logout,
    loginWithApi,
  }
})
