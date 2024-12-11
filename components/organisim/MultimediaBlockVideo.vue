<template>
    <div>

        <h3 class="text-s font-bold text-tarawera-700 my-4">Main Video:</h3>
        <InputFile type="video" />
        <h3 class="text-s font-bold text-tarawera-700 my-4">Subtitle:</h3>
        <textarea v-model="textContent" class="w-full h-32 border rounded p-2" placeholder="Add subtitle..."></textarea>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Background Image:</h3>
        <InputFile type="image" />
    </div>
</template>
<script setup lang="ts">
import InputFile from '~/components/InputFile.vue';
import EventBus from '~/composables/useEvenBus';
import { ref, watch } from 'vue';

const selectedOption = ref('');

const formData = ref({
    title: '',
    instructions: ''
});

const textContent = ref('');

const data = ref({
    video: null,
    script: '',
    backgroundImage: null,
    tittle: '',
    instructions: ''
});

EventBus.on('file-selected', (fileData: { url: string | null; fileType: string; file?: File }) => {
    if (fileData.fileType === 'video') {
        data.value.video = {
            url: fileData.url,
            file: fileData.file
        };
    } else if (fileData.fileType === 'image') {
        data.value.backgroundImage = {
            url: fileData.url,
            file: fileData.file
        };
    }
    emitUpdatedData();
});

EventBus.on('seletedOption', (value) => {
    selectedOption.value = value;
    console.log('seletedOption', value);

});

EventBus.on('instructions', (value) => {
    formData.value.title = value.title;
    formData.value.instructions = value.instructions;
});

watch(textContent, (newValue) => {
    data.value.script = newValue;
    console.log(data.value.script);
    emitUpdatedData();
});



const emitUpdatedData = () => {
    if (selectedOption.value === 'video') {
        EventBus.emit('multimedia-block-video', {
            ...data.value,
            ...formData?.value

        });
    } else if (selectedOption.value === 'audio') {
        EventBus.emit('multimedia-block-audio', {
           

        });
    }
};
</script>
