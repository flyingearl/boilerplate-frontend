<script setup>
import {XMarkIcon} from "@heroicons/vue/20/solid/index.js";
import {onMounted, ref} from "vue";
import classNames from "classnames";
import {useAlertStore} from "@/stores/alertStore.js";

const alertStore = useAlertStore()

const backgroundStyle = ref('')
const textStyle = ref('')
const buttonStyles = ref('')
const props = defineProps([
  'type',
  'message',
])

onMounted(() => {
  console.log(props)
  switch (props.type) {
    case 'success':
      backgroundStyle.value = 'bg-green-50'
      textStyle.value = 'text-green-800'
      buttonStyles.value = 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
      break
    case 'error':
      backgroundStyle.value = 'bg-red-50'
      textStyle.value = 'text-red-800'
      buttonStyles.value = 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
      break
  }
  setTimeout(() => {
    alertStore.dismissAlert()
  }, 5000)
})
</script>

<template>
  <div :class="classNames(backgroundStyle, 'p-4')">
    <div class="flex">
      <div class="ml-3">
        <p :class="classNames('text-sm font-medium', textStyle)">{{props.message}}</p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
              type="button"
              :class="classNames('cursor-pointer inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2', buttonStyles)"
              @click="alertStore.dismissAlert"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
