<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video"  />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
onMounted(() => {
    EventBus.on('file-selected', handleVideoSelected);
});

const handleVideoSelected = (videoUrl: string) => {
    console.log('Video selected:', videoUrl);
};
</script>


