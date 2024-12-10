<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video"  />
        <MoleculeInput type="text_area" title="Add script" size="lg" container-class="py-2" />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import Input from '~/components/molecule/Input.vue';
import EventBus from '~/composables/useEvenBus';

onMounted(() => {
    EventBus.on('file-selected', handleVideoSelected);
});

const handleVideoSelected = (videoUrl: string) => {
    console.log('Video selected:', videoUrl);
  
};
</script>


