<template>
  <!-- Общий контейнер для поля ввода -->
  <div class="relative">
    <!-- Название поля (если есть) -->
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <!-- Контейнер для поля ввода -->
    <div class="relative">
      <input
        :value="modelValue"
        @input="handleInput"
        @keypress="handleKeyPress"
        :type="type"
        :disabled="disabled"
        :inputmode="type === 'tel' ? 'numeric' : 'text'"
        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="[
          // Если есть ошибка - красная рамка, если нет - серая
          error
            ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
          // Если поле отключено - серый текст, если нет - черный
          disabled ? 'text-gray-500' : 'text-gray-900',
        ]"
      />
    </div>

    <!-- Сообщение об ошибке (если есть) -->
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup>
// Параметры компонента
const props = defineProps({
  // Текущее значение поля
  modelValue: String,
  // Название поля
  label: String,
  // Тип поля (текст, телефон и т.д.)
  type: {
    type: String,
    default: 'text',
  },
  // Текст ошибки
  error: String,
  // Отключено ли поле
  disabled: Boolean,
})

// Разрешаем компоненту отправлять изменения значения
const emit = defineEmits(['update:modelValue'])

// Обработка ввода в поле
const handleInput = (event) => {
  let value = event.target.value
  // Если это поле для телефона - оставляем только цифры и ограничиваем длину
  if (props.type === 'tel') {
    value = value.replace(/\D/g, '').substring(0, 11)
  }
  emit('update:modelValue', value)
}

// Обработка нажатия клавиш
const handleKeyPress = (event) => {
  if (props.type === 'tel') {
    // Для телефона разрешаем только цифры
    if (!/\d/.test(event.key)) {
      event.preventDefault()
    }
    // Проверяем длину номера (не больше 11 цифр)
    const numbers = event.target.value.replace(/\D/g, '')
    if (numbers.length >= 11) {
      event.preventDefault()
    }
  }
}
</script>
