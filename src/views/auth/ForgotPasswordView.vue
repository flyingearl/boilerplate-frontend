<script setup>
import InputField from '@/components/forms/InputField.vue'
import SubmitButton from '@/components/forms/SubmitButton.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useAlertStore } from '@/stores/alertStore.js'

const authStore = useAuthStore()
const alertStore = useAlertStore()
const email = ref('')
const errors = ref(null)

async function handleReset() {
  const response = await authStore.forgotPassword(email.value)
  if (!response.hasErrors) {
    alertStore.showAlertMessage('success', 'Password reset email sent successfully!')
  } else {
    errors.value = response.errors
    alertStore.showAlertMessage('error', 'Error sending password reset email. Please try again.')
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="handleReset">
      <InputField
        :display_name="`Email`"
        :field_name="`email`"
        :field_type="`email`"
        :errors="errors"
        v-model="email"
        :placeholder="`john@example.com`"
      />
      <SubmitButton :display_text="`Reset Password`" />
    </form>
  </main>
</template>
