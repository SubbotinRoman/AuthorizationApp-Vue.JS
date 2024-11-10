import { ref } from 'vue'

// Хук для работы с авторизацией
export function useAuth() {
  // Проверяем, авторизован ли пользователь (есть ли данные в localStorage)
  const isAuthenticated = ref(!!localStorage.getItem('user'))

  // Функция для входа в систему
  const login = async (email, password) => {
    // Сохраняем email в localStorage
    localStorage.setItem('loginEmail', email)

    // Создаем тестового пользователя с пустыми данными
    const mockUser = {
      id: 1,
      email: email,
      firstName: '',
      lastName: '',
      middleName: '',
      profession: '',
      phone: '',
      avatar: null,
    }

    // Сохраняем пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(mockUser))
    // Обновляем статус авторизации
    isAuthenticated.value = true
    return mockUser
  }

  // Функция для выхода из системы
  const logout = () => {
    // Удаляем все данные пользователя
    localStorage.removeItem('user')
    localStorage.removeItem('loginEmail')
    // Обновляем статус авторизации
    isAuthenticated.value = false
  }

  // Возвращаем нужные функции и данные
  return {
    isAuthenticated,
    login,
    logout,
  }
}
