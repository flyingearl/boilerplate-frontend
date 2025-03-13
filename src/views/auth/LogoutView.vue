<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.logout()
  await router.push({ name: 'home' })
})
</script>

<template>
  <main>
    <p>Logging out...</p>
  </main>
</template>
