<template>
  <!-- Основной контейнер с группировкой для hover-эффектов -->
  <div class="relative group">
    <!-- Контейнер фиксированного размера для аватара -->
    <div class="relative w-32 h-32">
      <!-- SVG-заглушка, показывается когда нет изображения -->
      <div
        v-if="!imageUrl"
        class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 shadow-lg transition-transform duration-300 group-hover:scale-105"
      >
        <svg
          class="w-full h-full text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <!-- Изображение аватара, показывается когда есть imageUrl -->
      <img
        v-else
        :src="imageUrl"
        :alt="`${firstName} ${lastName}`"
        class="w-32 h-32 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
      />

      <!-- Область для загрузки нового изображения, видна только в режиме редактирования -->
      <label v-if="editable" class="absolute inset-0 rounded-full cursor-pointer overflow-hidden">
        <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        <div
          class="w-full h-full bg-black opacity-0 hover:opacity-20 transition-all duration-300 flex items-center justify-center"
        >
          <span class="text-white font-medium">Изменить фото</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
// Определение входных параметров компонента
const props = defineProps({
  imageUrl: String, // URL изображения
  editable: Boolean, // Флаг редактируемости
  firstName: String, // Имя пользователя
  lastName: String, // Фамилия пользователя
})

// Определение исходящих событий
const emit = defineEmits(['update:imageUrl'])

// Обработчик загрузки нового изображения
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверки файла
  const validations = {
    isImage: file.type.startsWith('image/'),
    isValidSize: file.size <= 5 * 1024 * 1024, // 5MB
  }

  // Валидация типа файла
  if (!validations.isImage) {
    alert('Пожалуйста, выберите изображение')
    return
  }

  // Валидация размера файла
  if (!validations.isValidSize) {
    alert('Размер файла не должен превышать 5MB')
    return
  }

  // Чтение и конвертация файла в Data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:imageUrl', e.target.result)
  }
  reader.readAsDataURL(file)
}
</script>
