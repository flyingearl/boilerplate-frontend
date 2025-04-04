<script setup>
import api from '@/helpers/axios'
import {ref} from "vue";

const sent = ref(false)

async function resendVerificationEmail() {
  try {
    await api.post('/email/verification-notification')
    sent.value = true
  } catch (e) {
    console.log('Error sending verification email', e)
  }
}
</script>

<template>
  <div>
    Please verify your email
  </div>
  <div class="mt-8" v-if="!sent">
    <button
      class="bg-blue-500 rounded py-2 px-4 text-white cursor-pointer hover:bg-blue-700"
      @click="resendVerificationEmail"
    >
      Resend Verification Email
    </button>
  </div>
  <div v-else>
    <p class="text-green-500">Verification email sent successfully!</p>
  </div>
</template>
