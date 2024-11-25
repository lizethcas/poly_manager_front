<template>
    <div>
        <nav class="flex justify-start gap-4">
            <ul class="flex gap-4">
                <!-- Image Layout -->
                <li>
                    <button @click="handleModal('image')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Image Layout
                    </button>
                </li>
                
                <!-- Video Layout -->
                <li>
                    <button @click="handleModal('video')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Video Layout
                    </button>
                </li>

                <!-- Multiple Choice -->
                <li>
                    <button @click="handleModal('multipleChoice')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Multiple Choice
                    </button>
                </li>

                <!-- True/False -->
                <li>
                    <button @click="handleModal('trueFalse')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        True/False
                    </button>
                </li>

                <!-- Ordering Task -->
                <li>
                    <button @click="handleModal('ordering')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Ordering Task
                    </button>
                </li>

                <!-- Categories -->
                <li>
                    <button @click="handleModal('categories')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Categories
                    </button>
                </li>

                <!-- Fill in the Gaps -->
                <li>
                    <button @click="handleModal('fillGaps')" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Fill in the Gaps
                    </button>
                </li>
            </ul>
        </nav>

        <!-- Modal Container -->
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 overflow-y-auto">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
                <!-- Modal Header -->
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">{{ modalTitle }}</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                        <span class="sr-only">Close</span>
                        ×
                    </button>
                </div>

                <!-- Common Fields for All Layouts -->
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" v-model="formData.title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Instructions</label>
                        <textarea v-model="formData.instructions" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                    </div>
                </div>

                <!-- Specific Fields Based on Modal Type -->
                <div class="space-y-4">
                    <!-- Image Layout Fields -->
                    <template v-if="currentModal === 'image'">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Upload Image</label>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full">
                        </div>
                    </template>

                    <!-- Video Layout Fields -->
                    <template v-if="currentModal === 'video'">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Upload Video</label>
                            <input type="file" @change="handleFileUpload" accept="video/*" class="mt-1 block w-full">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Video Script</label>
                            <textarea v-model="formData.script" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                        </div>
                    </template>

                    <!-- Multiple Choice Fields -->
                    <template v-if="currentModal === 'multipleChoice'">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Question</label>
                            <input type="text" v-model="formData.question" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div class="space-y-2">
                            <div v-for="(answer, index) in formData.answers" :key="index" class="flex gap-2">
                                <input type="text" v-model="answer.text" placeholder="Answer" class="flex-1">
                                <input type="checkbox" v-model="answer.is_correct">
                                <button @click="removeAnswer(index)" class="text-red-500">Remove</button>
                            </div>
                            <button @click="addAnswer" class="text-blue-500">+ Add Answer</button>
                        </div>
                    </template>

                    <!-- True/False Fields -->
                    <template v-if="currentModal === 'trueFalse'">
                        <div class="space-y-2">
                            <div v-for="(question, index) in formData.questions" :key="index" class="space-y-2">
                                <input type="text" v-model="question.statement" placeholder="Statement" class="w-full">
                                <select v-model="question.state" class="w-full">
                                    <option value="1">True</option>
                                    <option value="2">False</option>
                                    <option value="3">Not Stated</option>
                                </select>
                                <button @click="removeQuestion(index)" class="text-red-500">Remove</button>
                            </div>
                            <button @click="addQuestion" class="text-blue-500">+ Add Statement</button>
                        </div>
                    </template>

                    <!-- Ordering Task Fields -->
                    <template v-if="currentModal === 'ordering'">
                        <div class="space-y-2">
                            <div v-for="(item, index) in formData.items" :key="index" class="flex gap-2">
                                <input type="text" v-model="item.text" placeholder="Item text" class="flex-1">
                                <button @click="removeOrderingItem(index)" class="text-red-500">Remove</button>
                            </div>
                            <button @click="addOrderingItem" class="text-blue-500">+ Add Item</button>
                        </div>
                    </template>

                    <!-- Categories Fields -->
                    <template v-if="currentModal === 'categories'">
                        <div class="space-y-4">
                            <div v-for="(category, categoryIndex) in formData.categories" :key="categoryIndex" class="space-y-2">
                                <div class="flex gap-2 items-center">
                                    <input type="text" v-model="formData.categories[categoryIndex]" placeholder="Category name" class="flex-1">
                                    <button @click="removeCategory(categoryIndex)" class="text-red-500">Remove Category</button>
                                </div>
                                <div class="pl-4 space-y-2">
                                    <div v-for="(item, itemIndex) in formData.categoryItems[category]" :key="itemIndex" class="flex gap-2">
                                        <input type="text" v-model="item.text" placeholder="Item text" class="flex-1">
                                        <button @click="removeItemFromCategory(category, itemIndex)" class="text-red-500">Remove</button>
                                    </div>
                                    <button @click="addItemToCategory(category)" class="text-blue-500">+ Add Item</button>
                                </div>
                            </div>
                            <button @click="addCategory" class="text-blue-500">+ Add Category</button>
                        </div>
                    </template>

                    <!-- Fill in the Gaps Fields -->
                    <template v-if="currentModal === 'fillGaps'">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Text with Gaps</label>
                                <textarea v-model="formData.text" placeholder="Use [gap] to indicate gaps" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                            </div>
                            <div class="space-y-2">
                                <div v-for="(keyword, index) in formData.keywords" :key="index" class="flex gap-2">
                                    <input type="text" v-model="formData.keywords[index]" placeholder="Keyword" class="flex-1">
                                    <button @click="formData.keywords.splice(index, 1)" class="text-red-500">Remove</button>
                                </div>
                                <button @click="formData.keywords.push('')" class="text-blue-500">+ Add Keyword</button>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Submit Button -->
                <div class="mt-6 flex justify-end">
                    <button @click="submitForm" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useModal } from '~/composables/useModal';

const { isOpen, openModal, closeModal } = useModal();
const currentModal = ref('');
const formData = ref({
    title: '',
    instructions: '',
    question: '',
    answers: [],
    questions: [],
    items: [],
    categories: [],
    categoryItems: {},
    text: '',
    keywords: [],
});

const modalTitle = computed(() => {
    const titles = {
        image: 'Image Layout',
        video: 'Video Layout',
        multipleChoice: 'Multiple Choice Task',
        trueFalse: 'True/False Task',
        ordering: 'Ordering Task'
    };
    return titles[currentModal.value] || '';
});

const handleModal = (type: string) => {
    currentModal.value = type;
    openModal();
};

const handleFileUpload = (type: string, file: File) => {
    // Handle file upload logic
};

const addAnswer = () => {
    formData.value.answers.push({ text: '', is_correct: false });
};

const removeAnswer = (index: number) => {
    formData.value.answers.splice(index, 1);
};

const addQuestion = () => {
    formData.value.questions.push({
        statement: '',
        state: '1'
    });
};

const removeQuestion = (index: number) => {
    formData.value.questions.splice(index, 1);
};

const addOrderingItem = () => {
    formData.value.items.push({
        text: '',
        order: formData.value.items.length + 1
    });
};

const removeOrderingItem = (index: number) => {
    formData.value.items.splice(index, 1);
};

const addCategory = () => {
    const categoryName = `Category ${formData.value.categories.length + 1}`;
    formData.value.categories.push(categoryName);
    formData.value.categoryItems[categoryName] = [];
};

const addItemToCategory = (category: string) => {
    formData.value.categoryItems[category].push({
        text: '',
        category: category
    });
};

const removeCategory = (index: number) => {
    const category = formData.value.categories[index];
    delete formData.value.categoryItems[category];
    formData.value.categories.splice(index, 1);
};

const removeItemFromCategory = (category: string, index: number) => {
    formData.value.categoryItems[category].splice(index, 1);
};

const submitForm = async () => {
    // Submit form logic based on currentModal.value
    // Use appropriate API endpoints for each task type
};
</script>