<template>
  <!-- Основной контейнер страницы входа -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Форма входа -->
    <div class="max-w-md w-full space-y-8">
      <!-- Заголовок -->
      <h2 class="mt-6 text-3xl font-bold text-gray-900 text-center">Войти в аккаунт</h2>

      <!-- Форма с полями ввода -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Поле для ввода email -->
        <div class="relative">
          <Input
            v-model="email"
            label="Email"
            type="email"
            :error="errors.email"
            :class="getFieldClasses(isValidEmail, email)"
            @input="validateOnType"
          />
          <!-- Индикатор правильности заполнения email -->
          <ValidationIndicator v-if="email" :show="true" :is-valid="isValidEmail" />
          <!-- Подсказки для заполнения email -->
          <ValidationHints
            v-if="email && !isValidEmail"
            title="Требования к email"
            :checks="emailValidationChecks"
          />
        </div>

        <!-- Поле для ввода пароля -->
        <div class="relative">
          <Input
            v-model="password"
            label="Пароль"
            :type="showPassword ? 'text' : 'password'"
            :error="errors.password"
            :class="getFieldClasses(isValidPassword, password)"
            @input="validateOnType"
            @toggle-password="togglePasswordVisibility"
          />
          <!-- Индикатор правильности заполнения пароля -->
          <ValidationIndicator v-if="password" :show="true" :is-valid="isValidPassword" />
          <!-- Подсказки для заполнения пароля -->
          <ValidationHints
            v-if="password && !isValidPassword"
            title="Пароль должен содержать"
            :checks="passwordChecks"
          />
        </div>

        <!-- Кнопка входа -->
        <Button
          type="submit"
          :loading="isLoading"
          :disabled="isLoading || !email || !password || !isValidEmail || !isValidPassword"
          class="w-full"
        >
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Input from '@/components/UI/Input.vue'
import Button from '@/components/UI/Button.vue'
import ValidationIndicator from '@/components/UI/ValidationIndicator.vue'
import ValidationHints from '@/components/UI/ValidationHints.vue'

// Подключаем роутер и функцию входа
const router = useRouter()
const { login } = useAuth()

// Состояния полей формы
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref({})

// Правила проверки email
const emailValidation = {
  format: computed(() => /^[^@]+@[^@]+\.[^@]+$/.test(email.value)),
  noSpaces: computed(() => !email.value.includes(' ')),
  validDomain: computed(() => /^[^@]+@(?:[^.@]+\.)+[^.@]{2,}$/.test(email.value)),
}

// Правила проверки пароля
const passwordValidation = {
  minLength: computed(() => password.value.length >= 8),
  hasUpperCase: computed(() => /[A-Z]/.test(password.value)),
  hasLowerCase: computed(() => /[a-z]/.test(password.value)),
  hasNumber: computed(() => /\d/.test(password.value)),
  hasSpecialChar: computed(() => /[!@#$%^&*]/.test(password.value)),
}

// Проверка валидности email
const isValidEmail = computed(() => Object.values(emailValidation).every((check) => check.value))

// Список подсказок для email
const emailValidationChecks = computed(() => [
  { valid: emailValidation.format.value, message: 'Корректный формат' },
  { valid: emailValidation.noSpaces.value, message: 'Без пробелов' },
  { valid: emailValidation.validDomain.value, message: 'Действительный домен' },
])

// Список подсказок для пароля
const passwordChecks = computed(() => [
  { valid: passwordValidation.minLength.value, message: 'Минимум 8 символов' },
  { valid: passwordValidation.hasUpperCase.value, message: 'Заглавную букву' },
  { valid: passwordValidation.hasLowerCase.value, message: 'Строчную букву' },
  { valid: passwordValidation.hasNumber.value, message: 'Цифру' },
  { valid: passwordValidation.hasSpecialChar.value, message: 'Специальный символ (!@#$%^&*)' },
])

// Проверка валидности пароля
const isValidPassword = computed(() =>
  Object.values(passwordValidation).every((check) => check.value),
)

// Стили для полей в зависимости от валидности
const getFieldClasses = (isValid, value) => ({
  'border-green-500 ring-green-200': isValid && value,
  'border-red-300': !isValid && value,
})

// Очистка ошибок при вводе
const validateOnType = () => {
  errors.value = {}
}

// Переключение видимости пароля
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Обработка отправки формы
const handleLogin = async () => {
  errors.value = {}
  // Проверяем правильность заполнения
  if (!isValidEmail.value || !isValidPassword.value) {
    errors.value = {
      email: !isValidEmail.value ? 'Введите корректный email адрес' : '',
      password: !isValidPassword.value ? 'Пароль не соответствует требованиям' : '',
    }
    return
  }

  // Отправляем форму
  isLoading.value = true
  try {
    await login(email.value, password.value)
    router.push('/profile')
  } catch {
    errors.value.email = 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}
</script>
