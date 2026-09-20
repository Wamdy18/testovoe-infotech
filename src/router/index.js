import { createRouter, createWebHistory } from 'vue-router'
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
  history: createWebHistory(),
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

  // Ролевая проверка
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return { name: 'main' } // или отдельная 403-страница
  }
})

export default router

// ПРЕДЫДУЩАЯ РЕАЛИЗАЦИЯ
// import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'

// const routes = [
//   {
//     path: '/',
//     redirect: '/dashboard',
//   },
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import('@/pages/LoginPage.vue'),
//     meta: { guestOnly: true }, // если уже залогинен — не пускать
//   },
//   {
//     path: '/dashboard',
//     name: 'dashboard',
//     component: () => import('@/pages/MainPage.vue'),
//     meta: { requiresAuth: true },
//   },
//   {
//     path: '/:pathMatch(.*)*',
//     redirect: '/login',
//   },
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })

// router.beforeEach((to) => {
//   const auth = useAuthStore()

//   // Защищённый роут, а пользователь не авторизован
//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     return { name: 'login', query: { redirect: to.fullPath } }
//   }

//   // Уже авторизован, но идёт на /login
//   if (to.meta.guestOnly && auth.isAuthenticated) {
//     return { name: 'dashboard' }
//   }
// })

// export default router
