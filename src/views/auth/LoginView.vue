<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import InputField from '@/components/forms/InputField.vue'
import SubmitButton from '@/components/forms/SubmitButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errors = ref(null)

async function handleLogin() {
  const checked = await authStore.checkAuth()
  if (checked.success) {
    await router.push({ name: 'home' })
  } else {
    const loggedIn = await authStore.login(email.value, password.value)
    if (!loggedIn.hasErrors) {
      await router.push({ name: 'home' })
    } else {
      errors.value = loggedIn.errors
    }
  }
}

</script>

<template>
  <main>
    <form @submit.prevent="handleLogin">
      <InputField
        :display_name="`Email`"
        :errors="errors"
        :field_name="`email`"
        :field_type="`email`"
        v-model="email"
        :placeholder="`john@example.com`"
      />
      <InputField
        :display_name="`Password`"
        :errors="errors"
        :field_name="`password`"
        :field_type="`password`"
        v-model="password"
      />
      <SubmitButton :display_text="`Login`" />
    </form>
  </main>
</template>
