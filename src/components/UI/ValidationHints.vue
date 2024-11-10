<template>
  <!-- Контейнер для подсказок -->
  <div class="mt-2 text-sm bg-white p-4 rounded-lg border border-red-100 shadow-sm">
    <!-- Заголовок -->
    <p class="font-medium text-red-600">{{ title }}:</p>

    <!-- Список подсказок -->
    <ul class="space-y-1">
      <!-- Подсказка -->
      <li v-for="check in checks" :key="check.message" class="flex items-center gap-2">
        <!-- Иконка статуса -->
        <span
          class="w-4 h-4 flex items-center justify-center"
          :class="check.valid ? 'text-green-500' : 'text-gray-400'"
        >
          {{ check.valid ? '✓' : '•' }}
        </span>

        <!-- Текст подсказки -->
        <span :class="check.valid ? 'text-green-600' : 'text-gray-600'">
          {{ check.message }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Принимаем параметры
defineProps({
  // Заголовок подсказок
  title: {
    type: String,
    required: true,
  },
  // Массив подсказок с полями valid и message
  checks: {
    type: Array,
    required: true,
    // Проверка формата данных
    validator: (checks) =>
      checks.every(
        (check) => typeof check.valid === 'boolean' && typeof check.message === 'string',
      ),
  },
})
</script>
