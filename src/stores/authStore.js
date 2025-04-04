import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/helpers/axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  async function verifyEmail(id, hash, params) {
    try {
      await api.get('/api/verify-email/' + id + '/' + hash, { params })
        return {
          hasErrors: false,
        }
    } catch (e) {
      console.log('e', e)
        return {
          hasErrors: true,
          errors: e.response.data.errors
        }
    }
  }

  async function login(email, password) {
    // login API Call
    await api.get('/sanctum/csrf-cookie')
    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      })
      if (response.status === 200) {
        isAuthenticated.value = true
        return {
          hasErrors: false,
        }
      } else {
        isAuthenticated.value = false
        return {
          hasErrors: true,
        }
      }
    } catch (e) {
      isAuthenticated.value = false
      return {
        hasErrors: true,
        errors: e.response.data.errors
      }
    }
  }

  async function register(full_name, email, password, password_confirmation) {
    await api.get('/sanctum/csrf-cookie')
    try {
      await api.post('/register', {
        email: email,
        name: full_name,
        password: password,
        password_confirmation: password_confirmation
      })
      return {
        hasErrors: false,
      }
    } catch (e) {
      return {
        hasErrors: true,
        errors: e.response.data.errors
      }
    }
  }

  async function logout() {
    isAuthenticated.value = false
    user.value = null
    await api.post('logout')
  }

  async function getUser() {
    // Make call to user endpoint to get user object
    const userData = await api.get('api/user')
    user.value = userData.data
    return userData.data
  }

  async function checkAuth() {
    // Make call to user endpoint to check if user is authenticated
    // if authenticated, set isAuthenticated to true and user to the user object and return true
    // if not authenticated, set isAuthenticated to false and user to null and return false
    try {
      const userData = await api.get('api/user')
      isAuthenticated.value = true
      user.value = userData.data
      return {
        success: true,
        redirect: null,
      }
    } catch (e) {
      if (e.response.status === 403 && e.response.data.message === "Your email address is not verified."){
        console.log('need to verify email')
        isAuthenticated.value = true
        return {
          success: false,
          redirect: '/confirm-email',
        }
      }

      isAuthenticated.value = false
      user.value = null
      return {
        success: false,
        redirect: null,
      }
    }
  }

  function setAuth(authenticated) {
    isAuthenticated.value = authenticated
  }

  return { isAuthenticated, user, logout, checkAuth, login, getUser, register, verifyEmail, setAuth }
})
