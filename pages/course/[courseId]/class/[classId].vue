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
        <div v-else-if="classTasks && classTasks.data.length > 0" class="mt-4 text-fuscous-gray-950">
            <template v-for="(task, index) in classTasks.data" :key="task.id">

                <div class="mt-3 cursor-pointer shadow-md shadow-fuscous-gray-300 rounded-lg p-4 my-4"
                    @click="handleShowEditNavigation(index)">
                    <div v-if="task.tittle !== ''">
                        <div class="flex justify-start gap-2">
                            <p class="bg-tarawera-200 text-tarawera-800 px-2 py-1 rounded-md">{{ getTaskNumber(index) }}</p>
                            <h3 class="text-lg font-bold">{{ capitalizeFirstLetter(task.tittle) }}</h3>
                        </div>
                        <p class="">{{ task.instructions }}</p>
                    </div>
                    <!-- Display content based on content_type -->
                    <div class="text-sm text-fuscous-gray-700">
                        <div v-if="task.content_type === 'multiple_choice' || task.content_type === 'category'">
                            <MultipleChoiceQuestion 
                                v-for="(question, index) in task.content_details.questions || task.content_details.categories" 
                                :key="index"
                                :question="question"
                            />
                        </div>

                        <div v-else-if="task.content_type === 'true_false'">
                            <TrueFalse
                                v-for="(question, index) in task.content_details.questions" 
                                :key="index"
                                :question="question"
                            />
                        </div>

                        <div v-else-if="task.content_type === 'fill_gaps'">
                            <Fill
                                v-for="(passage, index) in task.content_details.passages" 
                                :key="index"
                                :text="passage.text"
                                :keywords="passage.keywords"
                                :help_text="passage.help_text"
                                class="my-4"
                            />
                        </div>
                    </div>
                </div>


                <!-- Insert EditClassNavigation after the selected task -->
                <transition name="slide-up" @before-enter="beforeEnter" @enter="enter" @leave="leave"
                    v-bind:css="false">
                    <EditClassNavigation v-if="showEditNavigation && selectedTaskIndex === index && !isOpen"
                        @open-modal="openModalHandler" />
                </transition>
            </template>
        </div>

        <!-- No tasks message -->
        <div v-else class="font-bold flex justify-center items-center text-center mt-4 text-fuscous-gray-950 text-md">
            <div>
                <p>There are no activities created for this course yet.</p>
                <button @click="handleAddBlock"
                    class="hover:underline hover:text-tarawera-700 text-fuscous-gray-950 px-4 py-2 rounded-md">
                    Add Block
                </button>
                <EditClassNavigation v-if="showEditNavigation && !isOpen" @open-modal="openModalHandler" />
            </div>
        </div>

        <div v-if="isOpen">
            <BaseTaskModal :is-open="isOpen" @close="closeModal" :title="currentModal.label" v-model="formData"
                class="max-h-[80vh]  overflow-y-auto" :icon="currentModal.name">
                <component :is="getCurrentComponent()" />
            </BaseTaskModal>
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
import { useCapitalizerLetter } from '~/composables/useCapitalizerLetter';

import Task from '~/components/organisim/task.vue';
import VideoBlock from '~/components/organisim/VideoBlock.vue';
import TextBlock from '~/components/organisim/TextBlock.vue';
import MultimediaBlock from '~/components/organisim/MultimediaBlock.vue';
import InteractiveActivities from '~/components/organisim/InteractiveActivities.vue';
import OrganisimLayoutBlock from '~/components/organisim/LayoutBlock.vue';
import KnowledgeCheckBlock from '~/components/organisim/KnowledgeCheckBlock.vue';
import { useTaskStore } from '~/stores/task.store';
import MultipleChoiceQuestion from '~/components/molecule/MultipleChoiceQuestion.vue';
import TrueFalse from '~/components/molecule/TrueFalse.vue';
import Fill from '~/components/molecule/Fill.vue';

const taskStore = useTaskStore();
const route = useRoute();
const { capitalizeFirstLetter } = useCapitalizerLetter();
const { isOpen, closeModal, openModal } = useModal();
const { beforeEnter, enter, leave } = useAnimation();
const currentModal = ref({ label: '', name: '' });
const formData = ref({ title: '', instructions: '' });
const showEditNavigation = ref(false);
const selectedTaskIndex = ref(-1);

const classId = route.params.classId;
const closeModalHandler = computed(() => taskStore.getTask('modal'));
const titleTask = computed(() => taskStore.getTask('titleTask'));
watch(closeModalHandler, () => {
    closeModal();
})

const openModalHandler = (label: string, name: string) => {
    currentModal.value = { label, name };
    openModal();  // Asegúrate de abrir el modal
};

// Add the query to fetch tasks
const { data: classTasks, isLoading, error } = useQuery({
    queryKey: ['class-contents', classId],
    queryFn: async () => {
        const response = await axiosInstance.get(`${apiRoutes.classContent}?class_id=${classId}`);
        return response.data;
    },
});

// You can watch the query results
watch(classTasks, (newTasks) => {
    if (newTasks && newTasks.data) {
        const insertionIndex = taskStore.insertionIndex;
        if (insertionIndex !== -1 && newTasks.data) {
            // Insert the new task at the specific position
            newTasks.data.splice(insertionIndex + 1, 0, newTasks);
            // Reset the insertion index
            taskStore.setInsertionIndex(-1);
        }
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

const handleShowEditNavigation = (index: number) => {
    selectedTaskIndex.value = index;
    showEditNavigation.value = true;
    taskStore.setInsertionIndex(index); // Store the index where we want to insert
};

const handleAddBlock = () => {
    selectedTaskIndex.value = -1; // Reset the selected task index
    showEditNavigation.value = true;
};

/* const queryClient = useQueryClient(); */ // Get the queryClient instance

/* const mutation = useMutation({
    // ... other configuration
    onSuccess: (data) => {
        const insertionIndex = taskStore.insertionIndex;
        if (insertionIndex !== -1) {
            // Get current tasks
            const currentTasks = classTasks.value.data;
            // Insert new task at the correct position
            currentTasks.splice(insertionIndex + 1, 0, data);
            // Update the query cache with the new array
            queryClient.setQueryData(['class-contents', route.params.classId], {
                ...classTasks.value,
                data: currentTasks
            });
        }
        taskStore.addTask('modal', { modal: false });
        taskStore.setInsertionIndex(-1); // Reset the insertion index
    },
}); */

const getTaskNumber = (currentIndex: number) => {
    // Find the current section number (tasks with titles)
    let sectionCount = 1;
    let subCount = 1;
    let lastTitleIndex = -1;

    for (let i = 0; i <= currentIndex; i++) {
        if (classTasks.value.data[i].tittle !== '') {
            if (lastTitleIndex === -1) {
                // First titled task starts a new section
                lastTitleIndex = i;
                subCount = 1;
            } else {
                // Check if there are any empty titles between last titled task and current
                let hasEmptyTitlesBetween = false;
                for (let j = lastTitleIndex + 1; j < i; j++) {
                    if (classTasks.value.data[j].tittle === '') {
                        hasEmptyTitlesBetween = true;
                        break;
                    }
                }
                if (hasEmptyTitlesBetween) {
                    // If there are empty titles between last titled task and current, it's a new sub-task
                    subCount++;
                    lastTitleIndex = i;
                }
            }
        }
    }

    return `${sectionCount}.${subCount}`;
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
