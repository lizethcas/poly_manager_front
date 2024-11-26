<template>
    <BaseTaskModal
        :is-open="isOpen"
        title="Multiple Choice Task"
        :model-value="modelValue"
        @close="$emit('close')"
        @submit="$emit('submit')"
    >
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Question</label>
                <input 
                    type="text" 
                    v-model="modelValue.question" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
            </div>
            <div class="space-y-2">
                <div v-for="(answer, index) in modelValue.answers" :key="index" class="flex gap-2">
                    <input 
                        type="text" 
                        v-model="answer.text" 
                        placeholder="Answer" 
                        class="flex-1"
                    >
                    <input type="checkbox" v-model="answer.is_correct">
                    <button @click="removeAnswer(index)" class="text-red-500">Remove</button>
                </div>
                <button @click="addAnswer" class="text-blue-500">+ Add Answer</button>
            </div>
        </div>
    </BaseTaskModal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['isOpen', 'modelValue']);
const emit = defineEmits(['close', 'submit', 'update:modelValue']);

const addAnswer = () => {
    props.modelValue.answers.push({ text: '', is_correct: false });
};

const removeAnswer = (index: number) => {
    props.modelValue.answers.splice(index, 1);
};
</script> 