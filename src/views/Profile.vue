<template>
  <!-- Основная страница профиля -->
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-8">
      <!-- Шапка с заголовком и кнопкой выхода -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Мой профиль</h1>
        <Button @click="handleLogout" variant="secondary">Выйти</Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Секция с фото и кнопками управления -->
        <div class="flex flex-col items-center space-y-4">
          <Avatar
            v-model:imageUrl="profile.avatar"
            :editable="isEditing"
            :first-name="profile.firstName"
            :last-name="profile.lastName"
          />
          <ActionButtons
            :is-editing="isEditing"
            :is-saving="isSaving"
            :is-valid-form="isValidForm"
            @start-edit="startEditing"
            @cancel-edit="cancelEditing"
          />
        </div>

        <!-- Форма с полями профиля -->
        <form id="profileForm" @submit.prevent="saveProfile" class="md:col-span-2 space-y-6">
          <FormField
            v-for="field in formFields"
            :key="field.name"
            :modelValue="profile[field.name]"
            v-bind="getFieldProps(field)"
            @update:modelValue="(value) => handleFieldInput(field.name, value)"
          />

          <!-- Показ ошибки если есть -->
          <p v-if="errors.general" class="text-red-600 mt-2">{{ errors.general }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Импорт базовых компонентов и утилит Vue
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Импорт пользовательских компонентов
import Button from '@/components/UI/Button.vue'
import Avatar from '@/components/UI/Avatar.vue'
import FormField from '@/components/UI/FormField.vue'
import ActionButtons from '@/components/UI/ActionButtons.vue'

// Основные переменные
const router = useRouter()
const { logout } = useAuth()
const isEditing = ref(false) // включен ли режим редактирования
const isSaving = ref(false) // идет ли сохранение
const errors = ref({}) // ошибки формы
let profileBackup = null // сохраняем копию данных для отмены изменений

// Данные профиля пользователя
const profile = reactive({
  firstName: '',
  lastName: '',
  middleName: '',
  profession: '',
  email: '',
  phone: '',
  avatar: null,
})

// Описание полей формы
const formFields = [
  { name: 'lastName', label: 'Фамилия' },
  { name: 'firstName', label: 'Имя' },
  { name: 'middleName', label: 'Отчество' },
  { name: 'profession', label: 'Профессия' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Телефон', type: 'tel' },
]

// Правила проверки для текстовых полей
const nameValidation = {
  required: (value) => (value || '').length >= 2, // минимум 2 символа
  maxLength: (value) => (value || '').length <= 50, // максимум 50 символов
  onlyLetters: (value) => !value || /^[А-ЯЁа-яёA-Za-z\s-]+$/.test(value), // только буквы
  optional: (value) => !value || value.length === 0, // необязательное поле
}

// Правила проверки для каждого поля
const validators = {
  // Проверка имени
  firstName: computed(() => [
    {
      valid: !!profile.firstName && nameValidation.required(profile.firstName),
      message: 'Минимум 2 символа',
    },
    {
      valid: !profile.firstName || nameValidation.maxLength(profile.firstName),
      message: 'Максимум 50 символов',
    },
    {
      valid: !profile.firstName || nameValidation.onlyLetters(profile.firstName),
      message: 'Только буквы',
    },
  ]),
  // Проверка фамилии
  lastName: computed(() => [
    {
      valid: !!profile.lastName && nameValidation.required(profile.lastName),
      message: 'Минимум 2 символа',
    },
    {
      valid: !profile.lastName || nameValidation.maxLength(profile.lastName),
      message: 'Максимум 50 символов',
    },
    {
      valid: !profile.lastName || nameValidation.onlyLetters(profile.lastName),
      message: 'Только буквы',
    },
  ]),
  // Проверка отчества
  middleName: computed(() => [
    {
      valid:
        nameValidation.optional(profile.middleName) || nameValidation.required(profile.middleName),
      message: 'Минимум 2 символа',
    },
    {
      valid: !profile.middleName || nameValidation.maxLength(profile.middleName),
      message: 'Максимум 50 символов',
    },
    {
      valid: !profile.middleName || nameValidation.onlyLetters(profile.middleName),
      message: 'Только буквы',
    },
  ]),
  // Проверка профессии
  profession: computed(() => [
    {
      valid: nameValidation.optional(profile.profession) || profile.profession.length >= 2,
      message: 'Минимум 2 символа',
    },
    {
      valid: !profile.profession || profile.profession.length <= 100,
      message: 'Максимум 100 символов',
    },
    {
      valid: !profile.profession || /^[А-ЯЁа-яёA-Za-z\s-]+$/.test(profile.profession),
      message: 'Только буквы, пробелы и дефисы',
    },
  ]),
  // Проверка email
  email: computed(() => [
    { valid: /^[^@]+@[^@]+\.[^@]+$/.test(profile.email), message: 'Корректный формат' },
    { valid: !profile.email.includes(' '), message: 'Без пробелов' },
    {
      valid: /^[^@]+@(?:[^.@]+\.)+[^.@]{2,}$/.test(profile.email),
      message: 'Действительный домен',
    },
  ]),
  // Проверка телефона
  phone: computed(() => [
    {
      valid: !profile.phone || /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(profile.phone),
      message: 'Формат: +7 (999) 999-99-99',
    },
  ]),
}

// Проверяем правильность заполнения каждого поля
const isValid = {
  firstName: computed(() => validators.firstName.value.every((check) => check.valid)),
  lastName: computed(() => validators.lastName.value.every((check) => check.valid)),
  middleName: computed(() => validators.middleName.value.every((check) => check.valid)),
  profession: computed(() => validators.profession.value.every((check) => check.valid)),
  email: computed(() => validators.email.value.every((check) => check.valid)),
  phone: computed(() => validators.phone.value.every((check) => check.valid)),
}

// Проверяем можно ли сохранить форму
const isValidForm = computed(() => {
  if (!isEditing.value) return true
  const requiredFields = ['firstName', 'lastName', 'email', 'phone']
  return requiredFields.every((field) => isValid[field].value)
})

// Обработка ввода в поля формы
const handleFieldInput = (fieldName, value) => {
  if (fieldName === 'phone') {
    // Форматируем телефон
    let numbers = value.replace(/\D/g, '') // оставляем только цифры
    numbers = numbers.substring(0, 11) // максимум 11 цифр

    // Первая цифра всегда 7
    if (numbers.length > 0 && numbers[0] !== '7') {
      numbers = '7' + numbers.substring(1)
    }

    // Собираем номер в формате +7 (999) 999-99-99
    let formatted = ''
    if (numbers.length > 0) {
      formatted = '+7'
      if (numbers.length > 1) formatted += ` (${numbers.slice(1, 4)}`
      if (numbers.length > 4) formatted += `) ${numbers.slice(4, 7)}`
      if (numbers.length > 7) formatted += `-${numbers.slice(7, 9)}`
      if (numbers.length > 9) formatted += `-${numbers.slice(9)}`
    }

    profile[fieldName] = formatted
  } else {
    // Для остальных полей просто сохраняем значение
    profile[fieldName] = value
  }
  validateOnType()
}

// Проверка при вводе
const validateOnType = () => {
  errors.value = {}
  // Проверяем длину телефона
  if (profile.phone) {
    const phoneNumbers = profile.phone.replace(/\D/g, '')
    if (phoneNumbers.length < 11) {
      errors.value.phone = 'Введите полный номер телефона'
    }
  }
}

// Начало редактирования профиля
const startEditing = () => {
  // Сохраняем копию данных для возможности отмены
  profileBackup = JSON.parse(JSON.stringify(profile))
  isEditing.value = true
}

// Отмена редактирования
const cancelEditing = () => {
  if (profileBackup) {
    // Возвращаем данные из копии
    Object.keys(profileBackup).forEach((key) => {
      profile[key] = JSON.parse(JSON.stringify(profileBackup[key]))
    })
  }
  isEditing.value = false
  errors.value = {}
}

// Сохранение профиля
const saveProfile = async () => {
  if (!isValidForm.value) return

  isSaving.value = true
  errors.value = {}

  try {
    // Имитация задержки сервера
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Сохраняем в localStorage
    localStorage.setItem('user', JSON.stringify(profile))
    isEditing.value = false
  } catch (error) {
    errors.value = {
      general: 'Ошибка при сохранении профиля',
      details: error.message,
    }
  } finally {
    isSaving.value = false
  }
}

// Выход из профиля
const handleLogout = () => {
  // Очищаем все поля
  Object.keys(profile).forEach((key) => {
    profile[key] = ''
  })
  logout()
  router.push('/login')
}

// Настройки для полей формы
const getFieldProps = (field) => ({
  label: field.label,
  type: field.type || 'text',
  error: errors.value[field.name],
  disabled: !isEditing.value,
  // Показываем подсказки только если поле заполнено неверно
  validationChecks: !isValid[field.name].value ? validators[field.name]?.value || [] : [],
})

// Загрузка данных при открытии страницы
onMounted(() => {
  // Получаем сохраненные данные
  const savedUser = localStorage.getItem('user')
  const loginEmail = localStorage.getItem('loginEmail')

  if (savedUser) {
    // Если есть сохраненные данные - загружаем их
    const userData = JSON.parse(savedUser)
    Object.assign(profile, userData)
    // Добавляем email из логина если его нет
    if (loginEmail && !profile.email) {
      profile.email = loginEmail
    }
  } else {
    // Если данных нет - создаем тестовый профиль
    Object.assign(profile, {
      firstName: 'Иван',
      lastName: 'Иванов',
      middleName: 'Иванович',
      profession: 'Разработчик',
      email: loginEmail || '',
      phone: '+7 (999) 999-99-99',
      avatar: null,
    })
  }

  // Сохраняем данные в localStorage
  localStorage.setItem('user', JSON.stringify(profile))
})
</script>
