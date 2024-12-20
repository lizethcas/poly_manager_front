import { ref } from 'vue'

export const useModal = () => {
    const isOpen = ref(false)
    const selectedItem = ref(null)

    const openModal = (item = null) => {
        isOpen.value = true
        selectedItem.value = item
    }

    const closeModal = () => {
        isOpen.value = false
        selectedItem.value = null
    }

    return {
        isOpen,
        selectedItem,
        openModal,
        closeModal
    }
} 