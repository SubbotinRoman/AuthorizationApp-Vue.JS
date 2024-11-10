<template>
  <div class="flex gap-4">
    <!-- Кнопка редактирования, отображается только когда режим редактирования выключен -->
    <Button
      v-if="!isEditing"
      @click="$emit('start-edit')"
      variant="primary"
      class="w-full px-4 py-2"
    >
      Редактировать
    </Button>

    <!-- Группа кнопок для режима редактирования -->
    <template v-else>
      <!-- Кнопка сохранения с состояниями загрузки и валидации -->
      <Button
        type="submit"
        form="profileForm"
        variant="primary"
        :loading="isSaving"
        :disabled="!isValidForm || isSaving"
        class="px-4 py-2"
      >
        {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
      </Button>

      <!-- Кнопка отмены редактирования -->
      <Button @click="$emit('cancel-edit')" variant="secondary" class="px-4 py-2"> Отмена </Button>
    </template>
  </div>
</template>

<script setup>
// Импорт базового компонента кнопки
import Button from './Button.vue'

// Определение входных свойств компонента
defineProps({
  isEditing: Boolean, // Флаг режима редактирования
  isSaving: Boolean, // Флаг процесса сохранения
  isValidForm: Boolean, // Флаг валидности формы
})

// События, которые отправляет компонент наверх (в родительский компонент)
defineEmits(['start-edit', 'cancel-edit'])
</script>

<style scoped>
/* Базовые стили для кнопок */
.button {
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

/* Стили для отключенного состояния кнопки */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Стили для основной кнопки */
.button--primary {
  background-color: #3b82f6;
  color: white;
}

/* Эффект наведения для основной кнопки */
.button--primary:hover:not(:disabled) {
  background-color: #2563eb;
}

/* Стили для вторичной кнопки */
.button--secondary {
  background-color: #e5e7eb;
  color: #374151;
}

/* Эффект наведения для вторичной кнопки */
.button--secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}
</style>
