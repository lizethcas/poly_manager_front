<template>
    <div class="flex flex-nowrap w-full items-center justify-between gap-2">
        <div v-for="task in interactiveTaskData" 
             :key="task.alt"
             @click="$emit('open-task', task.title)"
             class="flex items-center justify-between p-2 max-w-[13%] w-full shrink-0 bg-fuscous-gray-100 rounded-lg cursor-pointer hover:scale-105 transition-all duration-300">
            <img :src="task.image" :alt="task.alt" class="w-10 h-8" />
            <p class="text-[0.6rem] text-center w-10">{{ task.title }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { interactiveTaskData } from '~/data/interactiveTask'

defineEmits(['open-task'])
</script>
