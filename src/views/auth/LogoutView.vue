<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {useAlertStore} from "@/stores/alertStore.js";

const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()

onMounted(async () => {
  await authStore.logout()
  await alertStore.showAlertMessage('success', 'You have been logged out!')
  await router.push({ name: 'home' })
})
</script>

<template>
  <main>
    <p>Logging out...</p>
  </main>
</template>
