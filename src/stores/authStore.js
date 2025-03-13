import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/helpers/axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

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
        return true
      } else {
        isAuthenticated.value = false
        return false
      }
    } catch {
      isAuthenticated.value = false
      return false
    }
  }

  async function logout() {
    isAuthenticated.value = false
    user.value = null
    await api.post('api/logout')
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
      return true
    } catch {
      isAuthenticated.value = false
      user.value = null
      return false
    }
  }

  return { isAuthenticated, user, logout, checkAuth, login, getUser }
})
