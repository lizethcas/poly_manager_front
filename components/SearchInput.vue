<template>
  <div class="relative w-full">
    <UInput
      v-model="query"
      @input="handleInput"
      @focus="handleFocus"
      ref="searchRef"
      name="query"
      placeholder="Buscar"
      icon="i-heroicons-magnifying-glass-20-solid"
      autocomplete="off"
      :ui="{ icon: { trailing: { pointer: '' } } }"
    >
      <template #trailing>
        <UButton
          v-show="query !== ''"
          color="gray"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          @click="query = ''"
        />
      </template>
    </UInput>

    <div
      v-if="isOpen && filteredResults.length > 0"
      class="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-10 overflow-hidden"
    >
      <div class="flex flex-col md:flex-row">
        <!-- Lista de resultados -->
        <div class="w-full md:w-1/2 border-r max-h-[70vh] overflow-y-auto p-2">
          <div
            v-for="(category, index) in filteredResults"
            :key="index"
            class="mb-4"
          >
            <h3 class="text-sm font-medium text-blue-600 mb-1">
              {{ category.category }}
            </h3>
            <ul class="space-y-1">
              <li
                v-for="(item, itemIndex) in category.items"
                :key="itemIndex"
                class="text-sm py-1 px-2 hover:bg-gray-100 rounded cursor-pointer flex items-start"
                @click="selectItem(item, category.category)"
                :class="{ 'bg-gray-100': selectedItem === item }"
              >
                <span class="text-gray-400 mr-2">•</span>
                {{ item.name || item.title }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Panel de detalles -->
        <div
          v-if="selectedItem"
          class="w-full md:w-1/2 p-4 max-h-[70vh] overflow-y-auto"
        >
          <component
            :is="getDetailComponent(selectedCategory)"
            :item="selectedItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useSearch } from "~/composables/useSearch";
import CourseDetails from "~/components/Search/CourseDetails.vue";
import ContentDetails from "~/components/Search/ContentDetails.vue";
import ClassDetails from "~/components/Search/ClassDetails.vue";
import NotesDetails from "~/components/Search/NotesDetails.vue";
import ScenarioDetails from "~/components/Search/ScenarioDetails.vue"; 

const searchRef: Ref<any> = ref(null);
const selectedItem: Ref<any> = ref(null);
const selectedCategory: Ref<string | null> = ref(null);
const studentId: string = useRoute().params.studentId;
// Use the search composable
const {
  searchTerm,
  searchResults: apiResults,
  isLoading,
  updateSearch,
} = useSearch(studentId);
console.log(apiResults);
// Update query to use searchTerm from composable
const query = computed({
  get: () => searchTerm.value,
  set: (value) => updateSearch(value, studentId),
});

const isOpen = computed(() => query.value.length > 0 && !isLoading.value);

// Update filteredResults to use API results
const filteredResults = computed(() => {
  if (!apiResults.value) return [];
  const data = apiResults.value;
 
  return [
    {
      category: "Cursos",
      items: data.cursos.map((course) => ({
        id: course.id,
        title: course.name,
        description: course.description,
        cover: course.cover,
      })),
    },
    {
      category: "Clases",
      items: data.clases.map((clase) => ({
        id: clase.id,
        title: clase.name,
        description: clase.description,
        image: clase.cover,
      })),
    },
    {
      category: "Notas",
      items: data.notas.map((nota) => ({
        id: nota.id,
        title: nota.title,
        content: nota.content,
        note_type: nota.note_type,
        tags: nota.tags,
        highlighted: nota.highlighted,
        color: nota.color,
        related_url: nota.related_url,
        related_content: nota.related_content,
        created_at: nota.created_at,
        updated_at: nota.updated_at,
      })),
    },
    {
      category: "Escenarios",
      items: data.escenarios.map((escenario) => ({
        id: escenario.id,
        name: escenario.name,
        description: escenario.description,
        cover: escenario.cover,
        goals: escenario.goals,
        objectives: escenario.objectives,
        student_information: escenario.student_information,
        role_polly: escenario.role_polly,
        role_student: escenario.role_student,
        conversation_starter: escenario.conversation_starter,
        vocabulary: escenario.vocabulary,
        key_expressions: escenario.key_expressions,
        end_conversation: escenario.end_conversation,
        end_conversation_saying: escenario.end_conversation_saying,
        feedback: escenario.feedback,
        scoring: escenario.scoring,
        additional_info: escenario.additional_info,
        created_at: escenario.created_at,
        updated_at: escenario.updated_at,
      })),
    },
  ];
});

const getDetailComponent = (category) => {
  switch (category) {
    case "Cursos":
      return CourseDetails;
    case "Contenidos":
      return ContentDetails;
    case "Clases":
      return ClassDetails;
    case "Notas":
      return NotesDetails;
    case "Escenarios":
      return ScenarioDetails; // Asegúrate de tener un componente ScenarioDetails.vue
    default:
      return null;
  }
};

const selectItem = (item, category) => {
  selectedItem.value = item;
  selectedCategory.value = category;
};

const openLesson = () => {
  // Aquí puedes implementar la lógica para abrir la lección
  console.log("Opening lesson:", selectedItem.value);
};

const handleInput = () => {
  if (query.value) {
    isOpen.value = true;
  }
};

const handleFocus = () => {
  if (query.value) {
    isOpen.value = true;
  }
};

const handleClickOutside = (event) => {
  if (searchRef.value?.$el && !searchRef.value.$el.contains(event.target)) {
    isOpen.value = false;
    selectedItem.value = null;
  }
};

// onMounted(() => {
//   document.addEventListener('mousedown', handleClickOutside);
// });

// onUnmounted(() => {
//   document.removeEventListener('mousedown', handleClickOutside);
// });
</script>

<style scoped>
/* Asegura que el scroll sea suave */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>