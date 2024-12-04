<template>
    <uploadImage v-model="formData.cover" @file-selected="handleCoverImage">
        <template #audio>
            <MoleculeInputFile type="text_area" title="Add script" size="lg" container-class="py-2" />
        </template>

    </uploadImage>
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
        <div v-if="tasksStore.questions.length > 0" v-for="(item, index) in tasksStore.questions"
            class="border-2 border-tarawera-700 rounded-md p-2" :draggable="true" role="listitem"
            @dragstart="onDragStart($event, index)" @dragover="onDragOver" @drop="onDrop($event, index)">
            <h3 class="text-s font-bold text-tarawera-700 my-4">

                {{
                    item.typeTask === 'correctAnswer' ? 'multiple choice' : item.typeTask

                }}
            </h3>
            <div>
                <p>pregunta:</p>
                <p>{{ item.question }}</p>
            </div>
            <div>
                <p>respuestas:</p>
                <p>{{ item.answers }}</p>
            </div>

        </div>

    </NuxtLayout>

</template>
<script setup lang="ts">
import uploadImage from '~/components/organisim/UploadImage.vue';
import MoleculeInputFile from '~/components/molecule/InputFile.vue';
import OrganisimMultipleTasks from '~/components/organisim/MultipleTasks.vue';
import TaskLayout from '~/layouts/TaskLayout.vue';
import { useDescription } from '~/composables/useDescription';
import { useTasksStore } from '~/stores/tasks.store';
import { useDragAnDrop } from '~/composables/useDragAndDrop';

const formData = ref<{ cover: File | null }>({ cover: null });
const taskTitle = ref<string>('Multiple choice')
defineEmits(['close', 'submit', 'update:modelValue']);

const { getTaskDescription } = useDescription();
const tasksStore = useTasksStore();
const { onDragStart, onDragOver, onDrop } = useDragAnDrop(tasksStore.questions);

onMounted(() => {
    console.log('tasksStore', toRaw(tasksStore.questions))
})

const handleCoverImage = (file: File) => {
    formData.value.cover = file;
};

const handleOpenTask = (title: string) => {
    taskTitle.value = title
    console.log(taskTitle.value)
}


</script>