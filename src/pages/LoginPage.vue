<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6" elevation="8">
          <v-card-title class="text-h5 text-center mb-2">
            Вход в систему
          </v-card-title>

          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            <div><b>Admin:</b> admin@demo.com / admin123</div>
            <div><b>Guest:</b> guest@demo.com / guest123</div>
          </v-alert>

          <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="form.password"
              label="Пароль"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :rules="[rules.required, rules.minLength]"
              variant="outlined"
              @click:append-inner="showPassword = !showPassword"
            />

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              density="compact"
            >
              {{ errorMessage }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              class="mt-4"
              :loading="isLoading"
              :disabled="!isFormValid"
            >
              Войти
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const isFormValid = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const rules = {
  required: (v) => !!v || 'Обязательное поле',
  email: (v) => /.+@.+\..+/.test(v) || 'Некорректный email',
  minLength: (v) => v.length >= 6 || 'Минимум 6 символов',
}

async function handleSubmit() {
  if (!isFormValid.value) return
  isLoading.value = true
  errorMessage.value = ''
  try {
    await auth.login(form)
    router.push(route.query.redirect || '/main')
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || 'Ошибка входа'
  } finally {
    isLoading.value = false
  }
}
</script>
