<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import InputField from '@/components/forms/InputField.vue'
import SubmitButton from '@/components/forms/SubmitButton.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useAlertStore } from '@/stores/alertStore.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()

const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errors = ref(null)

async function handleResetPassword() {
  const response = await authStore.resetPassword(route.params.token, email.value, password.value, password_confirmation.value)

  if (!response.hasErrors) {
    console.log('Password reset successfully')
    await alertStore.showAlertMessage('success', 'Password reset successfully!')
    await router.push({ name: 'login' })
  } else {
    console.error('Error resetting password:', response.errors)
    errors.value = response.errors
  }
}

onMounted(() => {
  console.log('Route params:', route.params)
  email.value = route.params.email || ''
})
</script>

<template>
  <main>
    <form @submit.prevent="handleResetPassword" class="space-y-2">
      <InputField
        :display_name="`Email`"
        :errors="errors"
        :field_name="`email`"
        :field_type="`email`"
        v-model="email"
        :placeholder="`john@example.com`"
      />
      <InputField
        :display_name="`New Password`"
        :errors="errors"
        :field_name="`password`"
        :field_type="`password`"
        v-model="password"
      />
      <InputField
        :display_name="`Confirm New Password`"
        :errors="errors"
        :field_name="`password_confirmation`"
        :field_type="`password`"
        v-model="password_confirmation"
      />
      <SubmitButton :display_text="`Reset Password`" />
    </form>
  </main>
</template>
