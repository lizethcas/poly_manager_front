<template>
    <div class="w-full flex justify-center gap-4">
        <UButton color="freshGreen"
            class="w-1/3 mx-2 flex justify-center items-center text-center text-white transform hover:scale-80 hover:shadow-lg active:scale-100 active:shadow-sm transition-all duration-300"
            @click="handleSave">
            Save
        </UButton>
        <UButton color="gray"
            class="w-1/3 flex justify-center items-center text-center text-gray-low transform hover:scale-80 hover:shadow-lg active:scale-100 active:shadow-sm transition-all duration-300"
            @click="handleCancel">
            Cancel
        </UButton>
    </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["handleSave", "handleCancel"])

const handleSave = () => {
    emits('handleSave')  // Emitir el evento handleSave
}

const handleCancel = () => {
    emits('handleCancel')  // Emitir el evento handleCancel
}
</script>
