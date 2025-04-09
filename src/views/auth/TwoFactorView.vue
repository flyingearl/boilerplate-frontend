<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import InputField from '@/components/forms/InputField.vue'

const code = ref('')
const errors = ref(null)
const router = useRouter()
const authStore = useAuthStore()

async function handleCodeSubmit() {
  const response = await authStore.send2FACode(code.value)

  if (!response.hasErrors) {
    console.log('2FA code verified successfully')
    // Redirect to the home page or another page
    router.push({name: 'home'})
  } else {
    console.error('Error verifying 2FA code:', response.errors)
    errors.value = response.errors
  }
}
</script>

<template>
  <form @submit.prevent="handleCodeSubmit">
    <InputField
      :display_name="`Authenticator Code`"
      :errors="errors"
      :field_name="`code`"
      :field_type="`text`"
      v-model="code"
      :placeholder="`123456`"
    />
    <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded mt-4">Submit</button>
  </form>
</template>
