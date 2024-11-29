<template>
    <uploadImage v-model="formData.cover" @file-selected="handleCoverImage">
        <template #audio>
            <MoleculeInputFile type="text_area" title="Add script" size="lg" container-class="py-2" />
        </template>

    </uploadImage>
    <NuxtLayout >
        <OrganisimInteractiveTask class="mt-4" @open-task="handleOpenTask" />
        <TaskLayout :title="taskTitle">
            <OrganisimMultipleChoice v-if="taskTitle === 'Multiple choice'" />
        </TaskLayout>
    </NuxtLayout>

</template>
<script setup lang="ts">
import uploadImage from '~/components/organisim/UploadImage.vue';
import MoleculeInputFile from '~/components/molecule/InputFile.vue';
import OrganisimMultipleChoice from '~/components/organisim/MultipleChoice.vue';
import TaskLayout from '~/layouts/TaskLayout.vue';

const formData = ref<{ cover: File | null }>({ cover: null });
const taskTitle = ref<string>('Multiple choice')

const handleCoverImage = (file: File) => {
    formData.value.cover = file;
};

const handleOpenTask = (title: string) => {
    taskTitle.value = title
    console.log(taskTitle.value)
}

</script>