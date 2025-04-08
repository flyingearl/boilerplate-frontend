import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  linkExactActiveClass: 'text-blue-600',
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
      path: '/account/profile',
      name: 'account.profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/account/ProfileView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: {
        requiresAuth: false,
        shouldBeGuest: true
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
      path: '/confirm-email',
      name: 'confirm.email',
      component: () => import('../views/auth/ConfirmEmailView.vue'),
      meta: {
        requiresAuth: false,
        shouldBeGuest: false
      }
    },
    {
      path: '/auth/verify-email/:id/:hash',
      name: 'verify.email',
      component: () => import('../views/auth/VerifyEmailView.vue'),
      meta: {
        requiresAuth: false,
        shouldBeGuest: false
      }
    },
    {
      path: '/auth/forgot-password',
      name: 'forgot.password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
      meta: {
        requiresAuth: false,
        shouldBeGuest: true
      }
    },
    {
      path: '/auth/reset-password/:token/:email',
      name: 'reset.password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
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
        requiresAuth: false,
      }
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const checked = await authStore.checkAuth()

  if (to.meta.requiresAuth && !checked.success) {
    if (checked.redirect) {
      return checked.redirect
    } else {
      return '/login'
    }
  } else if (
    !checked.success
    && checked.redirect === '/confirm-email'
    && to.name !== 'confirm.email'
    && to.name !== 'verify.email'
    && to.name !== 'logout'
  ) {
    return '/confirm-email'
  }
  //
  // // if (to.meta.requiresAuth && !checked) return '/login'
  // if (to.meta.shouldBeGuest && checked) return '/'
})

export default router
