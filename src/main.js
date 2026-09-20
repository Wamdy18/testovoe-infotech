import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import { roleDirective } from '@/directives/role'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.directive('role', roleDirective)

app.mount('#app')

// Использование в шаблоне блоков для разных ролей
{/* <v-btn v-role="'administrator'">Добавить</v-btn> */}
{/* <v-btn v-role="['administrator']">Удалить</v-btn> */}
