<template>
    <NuxtLayout>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Interactive task:</h3>
        <OrganisimInteractiveTask class="mt-4" @open-task="handleOpenTask" />
        <TaskLayout :title="taskTitle">
            <OrganisimMultipleTasks v-if="taskTitle === 'Multiple choice'" typeTask="multiple_choice"
                titleTask="Question " subtitleTask="Answer options:" :inputTitleTask="true" />
            <OrganisimMultipleTasks v-if="taskTitle === 'True or false'" typeTask="true_false" titleTask="Question" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Category'" typeTask="category" titleTask="Category"
                subtitleTask="Items:" :inputTitleTask="true" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Sorting'" typeTask="sorting" titleTask="Category"
                subtitleTask="Items:" :inputTitleTask="true" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Put in order'" typeTask="order"
                titleTask="Put in the right order " :inputTitleTask="true" />
            <OrganisimMultipleTasks v-if="taskTitle === 'Fill in the gaps' || taskTitle === 'Drag the words'"
                :typeTask="'text_area'" :description="getTaskDescription(taskTitle)" :inputTitleTask="true" />
        </TaskLayout>
    </NuxtLayout>
</template>

<script setup lang="ts">
import OrganisimMultipleTasks from '~/components/organisim/MultipleTasks.vue';
import OrganisimInteractiveTask from '~/components/organisim/InteractiveTask.vue';
import TaskLayout from '~/layouts/TaskLayout.vue';
import { useDescription } from '~/composables/useDescription';
import { useTaskStore } from '~/stores/task.store';
const taskTitle = ref<string>('Multiple choice')
defineEmits(['close', 'submit', 'update:modelValue']);

const { getTaskDescription } = useDescription();
const taskStore = useTaskStore();

const handleOpenTask = (title: string) => {
    taskTitle.value = title
    taskStore.addTask('titleTask', title.split(' ')[0])
  
}
</script>
