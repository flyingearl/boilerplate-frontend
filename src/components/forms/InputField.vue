<script setup>
import classNames from 'classnames'
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid/index.js'

const model = defineModel()
const props = defineProps([
  'field_type',
  'field_name',
  'display_name',
  'placeholder',
  'errors'
])
</script>

<template>
  <div>
    <label
      :for="props.field_name"
      class="block text-sm/6 font-medium text-gray-900">
        {{props.display_name}}
    </label>
    <div class="mt-2 max-w-100 grid grid-cols-1">
      <input :type="props.field_type"
             :name="props.field_name"
             :id="props.field_name"
             :class="classNames('block w-full rounded-md bg-white text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                 errors && errors.hasOwnProperty(props.field_name) ? 'col-start-1 row-start-1 py-1.5 pl-3 pr-10 text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 sm:pr-9'
                  : 'px-3 py-1.5 text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600'
                )"
             :placeholder="props.placeholder"
             v-model="model"
             aria-invalid="true"
             aria-describedby="email-error"
      />
      <ExclamationCircleIcon v-if="errors && errors.hasOwnProperty(props.field_name)" class="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4" aria-hidden="true" />
    </div>
    <p v-if="errors && errors.hasOwnProperty(props.field_name)"
       class="mt-2 text-sm text-red-600"
       id="email-error">{{errors[props.field_name][0]}}</p>
  </div>
</template>
