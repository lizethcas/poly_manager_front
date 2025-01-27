<template>
  <div class="bg-blue-50 rounded-lg p-6 max-w-3xl mx-auto flex gap-6 items-center">
    <div class="w-1/3">
      <img 
        src="~/assets/images/teacher.png" 
        alt="Virtual teacher assistant" 
        class="w-full h-auto"
      />
    </div>
    
    <div class="w-2/3 space-y-4">
      <div class="flex items-center gap-2 text-blue-500 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 class="text-xl">Time to talk!</h2>
      </div>

      <div class="space-y-3">
        <p class="text-gray-700 font-medium">
          Welcome to the Pollie Conversation Module! This interactive tool is designed to help you practice speaking in English in a fun and engaging way. Follow these steps to get started:
        </p>

        <ol class="list-decimal list-inside text-sm space-y-2 text-gray-600 ml-4">
          <li>This conversation module is related to the topic from this lesson.</li>
          <li>Before starting, review the key expressions and vocabulary covered in the class.</li>
          <li>The module will simulate a real-life situation where you'll use what you've learned.</li>
          <li>Activate Pollie by clicking the "Start Conversation" button.</li>
        </ol>

        <button class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mt-4" 
          @click="openPopup(scenarios[0])">
          Start conversation
        </button>
      </div>
    </div>
  </div>

  <!-- Popup container -->
  <div v-if="isPopupOpen" class="popup">
    <PracticeScenario :scenario="selectedScenario" />
    <button @click="closePopup">Close</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { get } from "~/services/routes.api";
import { apiRoutes } from "~/services/routes.api";
import PracticeScenario from '~/components/organisim/templatesUsers/teachers/PracticeScenario.vue';
import { useRouter } from "vue-router";

const router = useRouter();
const isPopupOpen = ref(false);
const selectedScenario = ref({});
const classId = router.currentRoute.value.params.classId;

// Add query to fetch scenarios
const { data: scenarios } = useQuery({
  queryKey: ["scenarios-with-courses"],
  queryFn: async () => {
    const scenariosData = await get(apiRoutes.scenarios.getAll) || [];
    const coursesData = await get(apiRoutes.courses) || [];

    return Array.isArray(scenariosData) ? scenariosData.map(scenario => {
      const courseInfo = Array.isArray(coursesData) 
        ? coursesData.find(course => course.class_id === scenario.courseId)
        : null;
      
      return {
        ...scenario,
        course: {
          level: courseInfo?.level || 'N/A',
          category: courseInfo?.category || 'N/A'
        }
      };
    }) : [];
  }
});

// Add computed property to filter scenarios
const filteredScenarios = computed(
  () => scenarios.value?.filter((scenario) => scenario.classId === classId) || []
);

const openPopup = (scenario) => {
  selectedScenario.value = scenario;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  selectedScenario.value = {};
};
</script>
