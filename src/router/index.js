import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import ProfileView from '@/views/Profile.vue'

const router = createRouter({
  history: createWebHashHistory('/AuthorizationApp-Vue.JS/'),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('user')
        if (isAuthenticated) {
          next('/profile')
        } else {
          next()
        }
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: (to, from, next) => {
        const isAuthenticated = localStorage.getItem('user')
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
