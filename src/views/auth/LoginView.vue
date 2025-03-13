<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

async function handleLogin() {
  const checked = await authStore.checkAuth()
  if (checked) {
    await router.push({ name: 'home' })
  } else {
    const loggedIn = await authStore.login(email.value, password.value)
    if (loggedIn) {
      await router.push({ name: 'home' })
    }
  }
}

</script>

<template>
  <main>
    <form @submit.prevent="handleLogin">
      <div>
        <input type="email" placeholder="Email" v-model="email" />
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </main>
</template>
