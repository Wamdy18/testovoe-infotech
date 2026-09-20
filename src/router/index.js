import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/main' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/main',
    name: 'books',
    component: () => import('@/pages/MainPage.vue'),
    meta: { requiresAuth: true, title: 'Книги' },
  },
  {
    path: '/authors',
    name: 'authors',
    component: () => import('@/pages/AuthorsPage.vue'),
    meta: { requiresAuth: true, title: 'Авторы' },
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('@/pages/ReportPage.vue'),
    meta: { requiresAuth: true, title: 'Отчёт' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'main' }
  }

  // роли
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return { name: 'main' }
  }
})

export default router
