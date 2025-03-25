import { ref } from 'vue'

export const useCustomModal = () => {
    const isOpen = ref(false)
    const selectedItem = ref<any>(null)

    const openModal = (item: any = null) => {
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