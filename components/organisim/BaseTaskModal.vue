<template>
    <div v-if="isOpen"
        class="fixed top-0 left-0 w-full min-h-full bg-gray-600 bg-opacity-50 flex justify-center items-start pt-20">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                    <Icon :name="icon" size="30" class="text-primary-color" />
                    <h2 class="text-xl font-bold text-primary-color">{{ title }}</h2>
                </div>
                <img src="../../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
                    @click="$emit('close')" />
            </div>

            <!-- Common Fields -->
            <div class="space-y-4 mb-6">
                <h2>{{ title }}</h2>
                <MoleculeInputFile :title="'Title'" type="text" />
                <MoleculeInputFile :title="'Instructions'" type="text_area" />
            </div>
            <!-- Slot for specific content -->
            <slot></slot>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end">
                <button @click="$emit('submit')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps(['isOpen', 'title', 'modelValue', 'icon', 'type']);
defineEmits(['close', 'submit', 'update:modelValue']);
</script>