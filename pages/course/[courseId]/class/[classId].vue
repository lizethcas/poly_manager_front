<template>
    <div class="w-full">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center mt-4">
            <p>Loading tasks...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-red-500 flex justify-center items-center mt-4">
            <p>Error loading tasks: {{ error.message }}</p>
        </div>

        <!-- Tasks list -->
        <div v-else-if="classTasks && classTasks.data.length > 0" class="mt-4">
            <TaskLayout v-for="task in classTasks.data" :key="task.id" :title="task.tittle || 'Untitled Task'"
                :description="task.instructions || ''">
                <div class="mt-3">
                    <!-- Display content based on content_type -->
                    <div class="text-sm text-fuscous-gray-700">
                       

                        <!-- You can add specific components based on content_type -->
                        <div v-if="task.content_type === 'multiple_choice'">
                            <div v-for="(option, index) in task.content_details.questions" :key="index">
                                <p>{{ option.text }}</p>


                                <div v-for="(answer, index) in option.answers" :key="index">
                                    <!-- <input type="radio" :name="'task-' + task.id" :id="'option-' + index" :checked="answer.isCorrect" readonly> -->
                                    <label :for="'option-' + index" class="ml-2" :class="{ 'text-green-500': answer.isCorrect }">{{ answer.text }}</label>
                                </div>
                            </div>
                        </div>

                       <!--  <div v-else-if="task.content_type === 'true_false'">
                            <div class="flex gap-4">
                                <label>
                                    <input type="radio" name="'task-'+task.id" value="true"> True
                                </label>
                                <label>
                                    <input type="radio" name="'task-'+task.id" value="false"> False
                                </label>
                            </div>
                        </div>

                        <div v-else-if="task.content_type === 'sorting'">
                         
                            <p>Sorting activity</p>
                        </div> -->
                    </div>
                </div>
            </TaskLayout>
        </div>

        <!-- No tasks message -->
        <div v-else class="font-bold flex justify-center items-center text-center mt-4 text-fuscous-gray-950 text-md">
            <div>
                <p>There are no activities created for this course yet.</p>
                <button @click="showEditNavigation = true"
                    class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">
                    Add Block
                </button>
            </div>
        </div>

        <!-- Rest of your existing template code... -->
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useModal } from '~/composables/useModal';
import EditClassNavigation from '~/components/organisim/EditClassNavigation.vue';
import BaseTaskModal from '~/components/organisim/BaseTaskModal.vue';
import { useAnimation } from '~/composables/useAnimation';
import { useQuery } from '@tanstack/vue-query';
import { apiRoutes } from '~/services/routes.api';
import axiosInstance from '~/services/axios.config';
import { useRoute } from 'vue-router';

import Task from '~/components/organisim/task.vue';
import VideoBlock from '~/components/organisim/VideoBlock.vue';
import TextBlock from '~/components/organisim/TextBlock.vue';
import MultimediaBlock from '~/components/organisim/MultimediaBlock.vue';
import InteractiveActivities from '~/components/organisim/InteractiveActivities.vue';
import OrganisimLayoutBlock from '~/components/organisim/LayoutBlock.vue';
import KnowledgeCheckBlock from '~/components/organisim/KnowledgeCheckBlock.vue';
import { useTaskStore } from '~/stores/task.store';
import TaskLayout from '~/layouts/TaskLayout.vue';
const { isOpen, closeModal, openModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();

const taskStore = useTaskStore();
const currentModal = ref({ label: '', name: '' });
const formData = ref({ title: '', instructions: '' });
const showEditNavigation = ref(false);

const closeModalHandler = computed(() => taskStore.getTask('modal'));
watch(closeModalHandler, () => {
    closeModal();
})

const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };
    openModal();  // Asegúrate de abrir el modal
};

const route = useRoute();
const classId = route.params.classId;

// Add the query to fetch tasks
const { data: classTasks, isLoading, error } = useQuery({
    queryKey: ['class-contents', classId],
    queryFn: async () => {
        const response = await axiosInstance.get(`${apiRoutes.classContent}`);
        return response.data;
    },
});

// You can watch the query results
watch(classTasks, (newTasks) => {
    if (newTasks) {
        console.log('Class tasks:', newTasks.data);
    }
});

const getCurrentComponent = () => {
    switch (currentModal.value.label) {
        case 'Layout block': return OrganisimLayoutBlock;
        case 'Video layout': return VideoBlock;
        case 'Text block': return TextBlock;
        case 'Multimedia block': return MultimediaBlock;
        case 'Knowledge check': return KnowledgeCheckBlock;
        case 'Interactive activities': return InteractiveActivities;
        default: return null; // Devolver null si no hay coincidencia
    }
};

</script>

/* switch (title) {
case 'Layout block':
console.log(toRaw(combinedData.value));
tasksStore.saveTask(combinedData.value);
closeModal();
console.log(title);
break;
case 'Video layout':
console.log(title);
break;
case 'Text layout':
console.log(title);
break;
case 'Audio layout':
console.log(title);
break;
case 'Info block':
console.log(title);
break;
case 'SCORM file':
console.log(title);
break;
case 'Gallery layout':
console.log(title);
break;
case 'AI chat':
console.log(title);
break;
case 'Multimedia block':
console.log(title);
break;
case 'Interactive activities':
console.log(title);
break;
case 'Knowledge check':
console.log(title);
break;
case 'Word list':
console.log(title);
break;
case 'Table':
console.log(title);
break;
case 'Dividers':
console.log(title);
break;
default:
console.log(title);
break;
}
*/
