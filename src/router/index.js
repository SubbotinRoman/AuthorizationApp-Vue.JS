import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import ProfileView from '@/views/Profile.vue'

// Настройка навигации по сайту
const router = createRouter({
  // Включаем красивые адреса страниц без # в адресе
  history: createWebHistory(),
  // Описываем все страницы сайта
  routes: [
    {
      // При заходе на главную - перебрасываем на страницу входа
      path: '/',
      redirect: '/login',
    },
    {
      // Страница входа в аккаунт
      path: '/login',
      name: 'login',
      component: LoginView,
      // Проверка перед показом страницы
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('user')
        // Если уже вошел в аккаунт - перебрасываем в профиль
        if (isAuthenticated) {
          next('/profile')
        } else {
          next()
        }
      },
    },
    {
      // Страница профиля пользователя
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      // Проверка перед показом страницы
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('user')
        // Если не вошел в аккаунт - перебрасываем на вход
        if (!isAuthenticated) {
          next('/login')
        } else {
          next()
        }
      },
    },
  ],
})

export default router
