<template>
    <uploadImage v-model="formData.cover" @file-selected="handleCoverImage" />

    <MoleculeInput type="text_area" title="Add script" size="lg" container-class="py-2" />


    <NuxtLayout>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Interactive task:</h3>
        <OrganisimInteractiveTask class="mt-4" @open-task="handleOpenTask" />
        <TaskLayout :title="taskTitle">

            <OrganisimMultipleTasks v-if="taskTitle === 'Multiple choice'" typeTask="correctAnswer"
                titleTask="Question " subtitleTask="Answer options:" />
            <OrganisimMultipleTasks v-if="taskTitle === 'True or false'" typeTask="truefalse" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Category'" typeTask="category" titleTask="Category"
                subtitleTask="Items:" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Sorting'" typeTask="sorting" titleTask="Category"
                subtitleTask="Items:" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Put in order'" typeTask="order"
                titleTask="Put in the right order " />
            <OrganisimMultipleTasks v-if="taskTitle === 'Fill in the gaps' || taskTitle === 'Drag the words'"
                :typeTask="'text_area'" :description="getTaskDescription(taskTitle)" />


        </TaskLayout>

    </NuxtLayout>

</template>
<script setup lang="ts">
import uploadImage from '~/components/organisim/UploadImage.vue';
import MoleculeInput from '~/components/molecule/Input.vue';
import OrganisimMultipleTasks from '~/components/organisim/MultipleTasks.vue';
import TaskLayout from '~/layouts/TaskLayout.vue';
import { useDescription } from '~/composables/useDescription';
const formData = ref<{ cover: File | null }>({ cover: null });
const taskTitle = ref<string>('Multiple choice')
defineEmits(['close', 'submit', 'update:modelValue']);

const { getTaskDescription } = useDescription();

const handleCoverImage = (file: File) => {
    formData.value.cover = file;
};

const handleOpenTask = (title: string) => {
    taskTitle.value = title
    console.log(taskTitle.value)
}


</script>