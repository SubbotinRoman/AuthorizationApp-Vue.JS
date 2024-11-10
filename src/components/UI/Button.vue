<template>
  <!-- Главная кнопка -->
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      variantClasses[variant],
      // Делаем кнопку прозрачной если она отключена
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
      // Показываем значок загрузки вместо курсора
      loading ? 'cursor-wait' : '',
      $attrs.class,
    ]"
    class="px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    v-bind="$attrs"
  >
    <!-- Контейнер для содержимого кнопки -->
    <div class="flex items-center justify-center gap-2">
      <!-- Значок загрузки -->
      <span v-if="loading" class="animate-spin">⟳</span>
      <!-- Место для текста кнопки -->
      <slot />
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

// Настройки кнопки
const props = defineProps({
  // Тип кнопки (обычная или для отправки формы)
  type: {
    type: String,
    default: 'button',
  },
  // Цвет кнопки (синий или серый)
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  // Отключена ли кнопка
  disabled: Boolean,
  // Показывать ли загрузку
  loading: Boolean,
})

// Стили для разных цветов кнопки
const variantClasses = {
  // Синяя кнопка
  primary: 'bg-blue-600 text-white focus:ring-blue-500',
  // Серая кнопка
  secondary: 'bg-gray-200 text-gray-700 focus:ring-gray-500',
}
</script>
