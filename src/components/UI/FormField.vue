<template>
  <!-- Основной контейнер для поля формы -->
  <div class="relative">
    <!-- Компонент ввода с передачей всех необходимых параметров -->
    <Input
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :label="label"
      :type="type"
      :disabled="disabled"
      :error="error"
    />

    <!-- Показываем индикатор валидации если поле не отключено и есть значение -->
    <ValidationIndicator
      v-if="!disabled && modelValue"
      :show="true"
      :is-valid="!error && !hasInvalidChecks"
    />

    <!-- Показываем подсказки валидации если поле активно и есть правила проверки -->
    <ValidationHints
      v-if="!disabled && modelValue && validationChecks.length > 0"
      :title="label"
      :checks="validationChecks"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Input from './Input.vue'
import ValidationIndicator from './ValidationIndicator.vue'
import ValidationHints from './ValidationHints.vue'

// Входные параметры компонента
const props = defineProps({
  // Значение поля
  modelValue: String,
  // Название поля
  label: String,
  // Тип поля (text, password и т.д.)
  type: String,
  // Отключено ли поле
  disabled: Boolean,
  // Текст ошибки
  error: String,
  // Список правил для проверки
  validationChecks: {
    type: Array,
    default: () => [],
  },
})

// Проверяем есть ли неправильно заполненные правила
const hasInvalidChecks = computed(() => {
  return props.validationChecks.some((check) => !check.valid)
})

// Разрешаем компоненту отправлять обновления значения
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Стили для поля ввода */
.input-field {
  position: relative;
  width: 100%;
}

/* Стили для названия поля */
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

/* Стили для индикатора валидации */
.validation-indicator {
  position: absolute;
  right: 0.75rem;
  top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Стили для блока с подсказками */
.validation-hints {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #fee2e2;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Стили для отдельной подсказки */
.validation-hint-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

/* Убираем отступ у первой подсказки */
.validation-hint-item:first-child {
  margin-top: 0;
}

/* Стили для иконки в подсказке */
.hint-icon {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Стили для текста подсказки */
.hint-text {
  flex: 1;
}

/* Стили для правильно заполненного поля */
.hint-text.valid {
  color: #059669;
}

/* Стили для неправильно заполненного поля */
.hint-text.invalid {
  color: #4b5563;
}
</style>
