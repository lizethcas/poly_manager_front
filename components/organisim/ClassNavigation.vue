<template>
    <nav class="flex justify-start gap-4">
        <ul class="flex gap-4">
            <li v-for="task in tasks" :key="task.type">
                <button 
                    @click="$emit('open-modal', task.type)" 
                    class="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {{ task.label }}
                </button>
            </li>
        </ul>
    </nav>

</template>

<script setup lang="ts">



const tasks = [
    { type: 'image', label: 'Image Layout' },
    { type: 'video', label: 'Video Layout' },
    { type: 'multipleChoice', label: 'Multiple Choice' },
    { type: 'true_false', label: 'True/False' },
    { type: 'ordering', label: 'Ordering Task' },
    { type: 'categories', label: 'Categories' },
    { type: 'fillGaps', label: 'Fill in the Gaps' }
];
</script> 