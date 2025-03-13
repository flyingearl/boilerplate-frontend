<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()
</script>

<template>
  <div class="m-8">
    <div class="space-x-8 mb-8">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about" v-if="authStore.isAuthenticated">About</RouterLink>
      <RouterLink to="/login" v-if="!authStore.isAuthenticated">Login</RouterLink>
      <RouterLink to="/logout" v-if="authStore.isAuthenticated">Logout</RouterLink>
    </div>

    <RouterView />
  </div>
</template>
