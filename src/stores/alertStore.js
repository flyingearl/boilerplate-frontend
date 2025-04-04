import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', () => {
    const showAlert = ref(false)
    const alert = ref({
        type: '',
        message: ''
    })

    function dismissAlert() {
        showAlert.value = false
        alert.value.type = ''
        alert.value.message = ''
    }

    function showAlertMessage(type, message) {
        showAlert.value = true
        alert.value.type = type
        alert.value.message = message
    }

    return { showAlert, dismissAlert, showAlertMessage, alert }
})
