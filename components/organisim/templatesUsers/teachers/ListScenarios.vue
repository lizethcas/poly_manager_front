<template>
  <div v-for="scenario in scenarios" :key="scenario.id"  @click="openPopup(scenario)"
    class="w-full flex flex-row gap-2 md:gap-0 max-[480px]:flex-col bg-white
    border rounded-md cursor-pointer mt-4 hover:scale-105 transition-all
    duration-300 p-2" >
    <!-- Course Image -->
    <div class="rounded-md self-center md:self-auto">
      <img
        v-if="scenario.cover"
        :src="scenario.cover"
        alt=""
        class="rounded-md object-cover h-20 w-20"
      />
    </div>

    <!-- Course Info -->

    <div class="flex flex-col md:mt-0 md:ml-4 flex-grow justify-between">
      <div class="flex items-center gap-2">
        <h2
          class="text-fuscous-gray-600 font-bold text-base md:text-lg w-contain"
        >
          {{ scenario.name ||"no hay nombre"}}
        </h2>
        <!-- Level Badge -->
      </div>

      <!-- Course Name -->

      <!-- Stats -->

      <div class="flex md:items-center md:gap-4 mt-1 flex-wrap">
        <div
          class="bg-emerald-100 text-emerald-700 text-xs px-2 rounded-full flex items-center gap-1"
        >
          <IconMolecule
            :name="IconType.eye"
            :size="16"
            :color="'text-emerald-700'"
          />
          <span class="leading-none">published</span>
        </div>
        <!-- Modified stats section with responsive classes -->
        <div
          class="flex items-center gap-1 md:gap-2 text-gray-600 text-xs flex-wrap"
        ></div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col justify-between text-center">
      <div class="flex items-center gap-2">
        <span
          :class="[
            getLevelColor(scenario.course?.level, true),
            'text-xs font-semibold px-2 py-1 rounded-full text-fuscous-gray-950',
          ]"
        >
          {{ scenario.course?.level?.split(".")[0] }}
        </span>
        <!-- Course Type -->
        <span
          :class="[
            getLevelColor(scenario.course?.level, true),
            'text-xs font-semibold px-1 py-1 rounded-full text-fuscous-gray-950',
          ]"
          >{{ scenario.course?.category }}</span
        >
      </div>
      <div class="text-xs flex items-center gap-2">
        <button
          class="text-blue-500 px-4 py-1 rounded-full border border-blue-500"
        >
          preview
        </button>
        <button
          class="text-blue-500 px-4 py-1 rounded-full border border-blue-500 text-xs"
        >
          edit
        </button>
        <button
          @click.stop="handleDelete(scenario.id)"
          class="text-red-500 px-4 py-1 rounded-full border border-red-500 text-xs"
        >
          delete
        </button>
      </div>
    </div>
  </div>

  <div>
   
    <div v-if="isPopupOpen" class="popup">
      <PracticeScenario :scenario="selectedScenario" />
      <button @click="closePopup">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { get, del } from "~/services/routes.api";
import { apiRoutes } from "~/services/routes.api";
import PracticeScenario from "~/components/organisim/templatesUsers/teachers/PracticeScenario.vue";
import { useRouter } from "vue-router";
import { useGetColor } from "~/composables/useGetColor";
import { IconType } from "~/data/iconsType";
import IconMolecule from "~/components/atomos/Icon.vue";
import { useNotify } from '~/composables/useNotify'


const router = useRouter();
const isPopupOpen = ref(false);
const selectedScenario = ref({});
const classId = router.currentRoute.value.params.classId;
const { getLevelColor } = useGetColor();
const { success, error } = useNotify()


// Modified query to include course details
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
  () =>
    scenarios.value?.filter((scenario) => scenario.classId === classId) || []
);


const openPopup = (scenario) => {
  selectedScenario.value = scenario;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  selectedScenario.value = {};
};

const handleDelete = async (scenarioId) => {
  if (confirm("Are you sure you want to delete this scenario?")) {
    try {
      await del(`${apiRoutes.scenarios.delete(scenarioId)}`);
      success("Scenario deleted successfully");
      // Refresh the scenarios list
      await scenarios.value.refetch();
    } catch (err) {
      console.error("Error deleting scenario:", err);
      error("Error deleting scenario");
    }
  }
};
</script>
