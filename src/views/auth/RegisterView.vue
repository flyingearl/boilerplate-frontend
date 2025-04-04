<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'
import InputField from '@/components/forms/InputField.vue'
import SubmitButton from '@/components/forms/SubmitButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const full_name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const errors = ref(null)

async function handleRegister() {
  const checked = await authStore.checkAuth()
  if (checked) {
    await router.push({ name: 'home' })
  } else {
    const registered = await authStore.register(
      full_name.value,
      email.value,
      password.value,
      password_confirmation.value
    )
    if (!registered.hasErrors) {
      await router.push({ name: 'home' })
    } else {
      errors.value = registered.errors
    }
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="handleRegister" class="space-y-2">
      <InputField
        :display_name="`Full Name`"
        :errors="errors"
        :field_name="`name`"
        :field_type="`text`"
        v-model="full_name"
        :placeholder="`John Doe`"
      />
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
      <InputField
        :display_name="`Confirm Password`"
        :errors="errors"
        :field_name="`password_confirmation`"
        :field_type="`password`"
        v-model="password_confirmation"
      />
      <SubmitButton :display_text="`Register`" />
    </form>
  </main>
</template>
