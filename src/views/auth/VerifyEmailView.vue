<script setup>
import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {useAlertStore} from "@/stores/alertStore.js";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()

async function verifyEmail() {
  try {
    const params = new URLSearchParams(route.query)
    const response = await authStore.verifyEmail(route.params.id, route.params.hash, params)
    if (!response.hasErrors) {
      console.log('Email verified successfully')
      await alertStore.showAlertMessage('success', 'Email verified successfully!')
      await router.push({ name: 'home' })
    } else {
      console.error('Error verifying email:', response.errors)
      await alertStore.showAlertMessage('error', 'Could not verify email. Please try again.')
      await router.push({ name: 'home' })
    }
  } catch (e) {
    console.error('Error parsing URL params:', e)
    await alertStore.showAlertMessage('error', 'Could not verify email. Please try again.')
    await router.push({ name: 'home' })
  }
}

onMounted(async () => {
  await verifyEmail()
})
</script>

<template>
  <main>
    <p>Verify</p>
  </main>
</template>
