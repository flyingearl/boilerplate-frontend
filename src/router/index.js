import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        requiresAuth: false,
        shouldBeGuest: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/auth/LogoutView.vue'),
      meta: {
        requiresAuth: true,
      }
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const checked = await authStore.checkAuth()

  if (to.meta.requiresAuth && !checked) return '/login'
  if (to.meta.shouldBeGuest && checked) return '/'
})

export default router
