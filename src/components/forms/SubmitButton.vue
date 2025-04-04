<script setup>
const props = defineProps([
  'display_text',
])
</script>

<template>
  <div class="mt-4">
    <button
      class="bg-blue-500 rounded py-2 px-4 text-white cursor-pointer hover:bg-blue-700"
      type="submit"
    >{{props.display_text}}</button>
  </div>
</template>
