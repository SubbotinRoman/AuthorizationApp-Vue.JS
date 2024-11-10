<template>
  <!-- Показываем индикатор только если show=true -->
  <span
    v-if="show"
    class="absolute right-4 top-8"
    :class="isValid ? 'text-green-500' : 'text-red-500'"
  >
    <!-- Показываем галочку если поле заполнено верно, крестик если неверно -->
    {{ isValid ? '✓' : '×' }}
  </span>
</template>

<script setup>
// Входные параметры компонента
defineProps({
  // Показывать ли индикатор
  show: Boolean,
  // Валидно ли поле
  isValid: Boolean,
})
</script>
