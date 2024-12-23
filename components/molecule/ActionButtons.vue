<template>
    <div class="w-full flex justify-center gap-4">
        <UButton :disabled="!isActive"  color="freshGreen"
            :class="[{ 'w-1/3 mx-2 flex justify-center items-center text-center text-white transform hover:scale-80 hover:bg-active:scale-100 active:shadow-sm transition-all duration-300' : isActive,
                'w-1/3 mx-2 flex justify-center items-center text-center opacity-50 cursor-not-allowed bg-gray-200 transform hover:scale-100 transition-all duration-300' : !isActive
             }]"  
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

interface Props {

    isActive: boolean;
    
}

const {  isActive, isLoading } = defineProps<Props>()




const emits = defineEmits(["handleSave", "handleCancel"])

const handleSave = () => {
    emits('handleSave')  // Emitir el evento handleSave
}

const handleCancel = () => {
    emits('handleCancel')  // Emitir el evento handleCancel
}
</script>
