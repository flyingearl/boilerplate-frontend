<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import InputField from '@/components/forms/InputField.vue'
import { useAlertStore } from '@/stores/alertStore.js'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const alertStore = useAlertStore()
const router = useRouter()
const instance = getCurrentInstance();

const open = ref(false)
const showNewPassword = ref(false)

const currentUser = ref(null)
const currentPasswordCheck = ref('')
const twoFactorSVG = ref(null)
const authenticatorCode = ref('')
const hideEnable = ref(false)
const confirmType = ref(null)
const displayRecoveryCodes = ref(false)
const recoveryCodes = ref(null)

const profile = ref({
  name: '',
  email: '',
  current_password: '',
  password: '',
  password_confirmation: '',
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

async function handleConfirmPassword() {
  const checkResponse = await authStore.confirmPassword(currentPasswordCheck.value)
  if (!checkResponse.hasErrors) {
    if (confirmType.value === 'enable-2fa') {
      const response = await authStore.enableTwoFactor()
      if (!response.hasErrors) {
        const svgResponse = await authStore.getTwoFactorSVG()
        twoFactorSVG.value = svgResponse
        open.value = false
        hideEnable.value = true
        currentPasswordCheck.value = ''
      }
    } else if (confirmType.value === 'disable-2fa') {
      const response = await authStore.remove2FA()
      if (!response.hasErrors) {
        twoFactorSVG.value = null
        hideEnable.value = false
        open.value = false
        currentPasswordCheck.value = ''
        alertStore.showAlertMessage('success', 'Two Factor Authentication disabled successfully!')
        await authStore.checkAuth()
        currentUser.value = authStore.user
      } else {
        errors.value = response.errors
      }
    } else if (confirmType.value === 'recovery-codes') {
      const response = await authStore.getRecoveryCodes()
      if (!response.hasErrors) {
        recoveryCodes.value = response.codes
        displayRecoveryCodes.value = true
      } else {
        errors.value = response.errors
      }
    }
  } else {
    errors.value = { current_password: checkResponse.errors.password }
    console.log(checkResponse.errors)
    console.log(errors.value)
  }
  open.value = false
  currentPasswordCheck.value = ''
  confirmType.value = null
}

async function showConfirmPassword(type) {
  confirmType.value = type
  open.value = true
}

async function handleReset() {
  profile.value.name = authStore.user.name
  profile.value.email = authStore.user.email
  profile.value.current_password = ''
  profile.value.password = ''
  profile.value.password_confirmation = ''
  errors.value = null
}

async function getTwoFactorSVG() {
  const response = await authStore.getTwoFactorSVG()
  if (!response.hasErrors) {
    twoFactorSVG.value = response
  } else {
    if (response.errors === 'Password confirmation required.') {
      await handleConfirmPassword()
    }
  }
}

async function handleAuthenticatorCode() {
  await authStore.confirmTwoFactor(authenticatorCode.value)
  await authStore.checkAuth()
  currentUser.value = authStore.user
}

onMounted(async () => {
  if (authStore.user) {
    profile.value.name = authStore.user.name
    profile.value.email = authStore.user.email
    currentUser.value = authStore.user
  }

  if (authStore.user.two_factor_recovery_codes && !authStore.user.two_factor_confirmed_at) {
    await getTwoFactorSVG()
  } else {
    twoFactorSVG.value = null
  }
})

watch(profile.value, async (newValue) => {
  showNewPassword.value = newValue.current_password.length > 0
})
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-10" @close="open = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
              >
                <div>
                  <div
                    class="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100"
                  >
                    <CheckIcon class="size-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900"
                      >Confirm Password</DialogTitle
                    >
                    <div class="mt-2">
                      <InputField
                        :display_name="``"
                        :errors="errors"
                        :field_name="`current_password`"
                        :field_type="`password`"
                        v-model="currentPasswordCheck"
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="handleConfirmPassword"
                  >
                    Enable
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <form @submit.prevent="updateProfile">
      <div class="space-y-12">
        <div
          class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"
        >
          <div>
            <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
            <p class="mt-1 text-sm/6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
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
              <p class="mt-2 text-sm text-gray-500" id="email-description">
                Only update if you would like to change your password.
              </p>
            </div>

            <div class="sm:col-span-4" v-if="showNewPassword">
              <InputField
                :display_name="`New Password`"
                :errors="errors"
                :field_name="`password`"
                :field_type="`password`"
                v-model="profile.password"
              />
              <p class="mt-2 text-sm text-gray-500" id="email-description">
                Only update if you would like to change your password.
              </p>
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
        <div
          class="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3"
        >
          <div>
            <h2 class="text-base/7 font-semibold text-gray-900">Two Factor Authentication</h2>
            <p class="mt-1 text-sm/6 text-gray-600">Two factor authentication</p>
          </div>

          <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div class="sm:col-span-4" v-if="!currentUser?.two_factor_recovery_codes && !hideEnable">
              <button
                class="bg-blue-500 text-white py-2 px-4 rounded"
                @click.prevent="showConfirmPassword('enable-2fa')"
              >
                Enable
              </button>
            </div>
            <div class="sm:col-span-4 space-x-2" v-else-if="currentUser?.two_factor_confirmed_at">
              <button
                class="bg-green-500 text-white py-2 px-4 rounded"
                @click.prevent="showConfirmPassword('recovery-codes')"
              >
                Show Recovery Codes
              </button>
              <button
                class="bg-red-500 text-white py-2 px-4 rounded"
                @click.prevent="showConfirmPassword('disable-2fa')"
              >
                Disable
              </button>
              <div class="sm:col-span-4" v-if="displayRecoveryCodes">
                <h3 class="text-base/7 font-semibold text-gray-900">Recovery Codes</h3>
                <p class="mt-1 text-sm/6 text-gray-600">
                  Save these recovery codes in a safe place. You can use them to access your account if you lose your two-factor authentication device.
                </p>
                <div class="mt-4">
                  <ul class="list-disc pl-5">
                    <li v-for="(code, index) in recoveryCodes" :key="index">{{ code }}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="sm:col-span-4" v-else>
              <div v-html="twoFactorSVG"></div>
              <div class="mt-4">
                <InputField
                  :display_name="`Enter code from your authenticator app`"
                  :errors="errors"
                  :field_name="`authenticator_code`"
                  :field_type="`text`"
                  v-model="authenticatorCode"
                />
              </div>
              <div class="mt-4">
                <button
                  class="bg-blue-500 text-white px-2 py-4 rounded"
                 @click.prevent="handleAuthenticatorCode"
                >Link Authenticator</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleReset">
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
