<template>  
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Attachment:</h3>
        <InputFile type="attachment" />
        <div class="flex flex-row items-start w-full">
            <h3 class="text-s font-bold text-tarawera-700 my-4">Text:</h3>
            <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>
        </div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputFile from '~/components/InputFile.vue';

const textContent = ref('');
</script>
