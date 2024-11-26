<template>
  <BaseTaskModal
    :is-open="isOpen"
    :model-value="modelValue"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
  <ClassNavigation @open-modal="handleModal" />
  </BaseTaskModal>
</template>

<script setup lang="ts">
import { useModal } from '~/composables/useModal';



defineEmits(['close', 'submit']);

const { isOpen, openModal, closeModal } = useModal();


const currentModal = ref('');

const formData = ref({
    title: '',
    instructions: '',
    // ... rest of the form data
});

const handleModal = (type: string) => {
    currentModal.value = type;
    openModal();
};


const submitForm = async () => {
    // Submit form logic based on currentModal.value
    try {
        // API call logic here
        closeModal();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};
 
</script> 