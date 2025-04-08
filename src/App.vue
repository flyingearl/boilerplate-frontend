<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import AlertTop from "@/components/AlertTop.vue";
import { useAlertStore } from "@/stores/alertStore.js";

const authStore = useAuthStore()
const alertStore = useAlertStore()
</script>

<template>
  <transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition duration-300"
    leave-active-class="transition duration-300"
  >
    <AlertTop
      v-if="alertStore.showAlert"
      :type="alertStore.alert.type"
      :message="alertStore.alert.message"
    />
  </transition>
  <div class="m-8">
    <div class="space-x-8 mb-8">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/account/profile" v-if="authStore.isAuthenticated">Profile</RouterLink>
      <RouterLink to="/login" v-if="!authStore.isAuthenticated">Login</RouterLink>
      <RouterLink to="/register" v-if="!authStore.isAuthenticated">Register</RouterLink>
      <RouterLink to="/logout" v-if="authStore.isAuthenticated">Logout</RouterLink>
    </div>

    <RouterView />
  </div>
</template>
