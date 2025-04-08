<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import { onMounted, ref, watch } from 'vue'
import InputField from '@/components/forms/InputField.vue'
import { useAlertStore } from '@/stores/alertStore.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const alertStore = useAlertStore()
const router = useRouter()

const showNewPassword = ref(false)

const profile = ref({
  name: '',
  email: '',
  current_password: '',
  password: '',
  password_confirmation: ''
})
const errors = ref(null)

async function updateProfile() {
  const response = await authStore.updateProfile(profile.value)
  if (!response.hasErrors) {
    await alertStore.showAlertMessage('success', 'Profile updated successfully!')
    const response = await authStore.checkAuth()
    if (!response.success && response.redirect) {
      await router.push(response.redirect)
    }
    await handleReset()
  } else {
    errors.value = response.errors
  }
}

async function handleReset() {
  profile.value.name = authStore.user.name
  profile.value.email = authStore.user.email
  profile.value.current_password = ''
  profile.value.password = ''
  profile.value.password_confirmation = ''
  errors.value = null
}

onMounted(() => {
  if (authStore.user) {
    profile.value.name = authStore.user.name
    profile.value.email = authStore.user.email
  }
})

watch(profile.value, async (newValue) => {
  showNewPassword.value = newValue.current_password.length > 0;
})
</script>

<template>
  <div>
    <form @submit.prevent="updateProfile">
      <div class="space-y-12">
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
            <p class="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>
          </div>

          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div class="sm:col-span-4">
              <InputField
                :display_name="`Full Name`"
                :errors="errors"
                :field_name="`name`"
                :field_type="`text`"
                v-model="profile.name"
                :placeholder="`John Doe`"
              />
            </div>

            <div class="sm:col-span-4">
              <InputField
                :display_name="`Email address`"
                :errors="errors"
                :field_name="`email`"
                :field_type="`email`"
                v-model="profile.email"
                :placeholder="`john@doe.com`"
              />
            </div>

            <div class="sm:col-span-4">
              <InputField
                :display_name="`Current Password`"
                :errors="errors"
                :field_name="`current_password`"
                :field_type="`password`"
                v-model="profile.current_password"
              />
              <p class="mt-2 text-sm text-gray-500" id="email-description">Only update if you would like to change your password.</p>
            </div>

            <div class="sm:col-span-4" v-if="showNewPassword">
              <InputField
                :display_name="`New Password`"
                :errors="errors"
                :field_name="`password`"
                :field_type="`password`"
                v-model="profile.password"
              />
              <p class="mt-2 text-sm text-gray-500" id="email-description">Only update if you would like to change your password.</p>
            </div>

            <div class="sm:col-span-4" v-if="showNewPassword">
              <InputField
                :display_name="`New Password Confirmation`"
                :errors="errors"
                :field_name="`password_confirmation`"
                :field_type="`password`"
                v-model="profile.password_confirmation"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleReset">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
      </div>
    </form>
  </div>
</template>
