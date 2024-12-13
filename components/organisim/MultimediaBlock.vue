<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Multimedia:</h3>
        <select v-model="selectedComponent" @change="handleChange">
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="embeddedVideo">Embedded Video</option>
            <option value="attachment">Attachment</option>
        </select>
        <MultimediaBlockVideo v-if="selectedComponent === 'video'" />
        <MultimediaBlockAudio v-if="selectedComponent === 'audio'" />
        <MultimediaBlockEmbeddedVideo v-if="selectedComponent === 'embeddedVideo'" />
        <MultimediaBlockAttachment v-if="selectedComponent === 'attachment'" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import MultimediaBlockVideo from '~/components/organisim/MultimediaBlockVideo.vue';
import MultimediaBlockAudio from '~/components/organisim/MultimediaBlockAudio.vue';
import MultimediaBlockEmbeddedVideo from '~/components/organisim/MultimediaBlockEmbeddedVideo.vue';
import MultimediaBlockAttachment from '~/components/organisim/MultimediaBlockAttachment.vue';
const selectedComponent = ref('video');
import { useTaskStore } from '~/stores/task.store';



const taskStore = useTaskStore();
const selectedOption = ref('video');

onMounted(() => {
    taskStore.addTask('selectedOption', selectedComponent.value);

})

const handleChange = () => {
    selectedOption.value = taskStore.getTask('multimedia');
    taskStore.addTask('multimedia', selectedComponent.value);
};

</script>
