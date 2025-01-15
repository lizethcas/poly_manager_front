<template>
  <div class="container mx-auto px-4 py-6">
    <div>
      <h1>Bienvenido a la clase</h1>
    </div>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <p>Cargando tareas...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-red-500 flex justify-center items-center mt-4">
      <p>Error al cargar las tareas: {{ error.message }}</p>
    </div>

    <div v-if="!classContents?.data || classContents?.data.length === 0">
      <pre>Aun no hay contenido para esta clase</pre>
    </div>

    <div v-if="classContents?.data && classContents.data.length > 0">
      <!-- Iteramos sobre cada ClassContent una sola vez -->
      <div v-for="content in classContents.data" :key="content.id" class="class-content-item border p-4 mb-4 bg-gray-100">
        <h2 class="text-xl font-bold">{{ content.tittle }}</h2>
        <p class="mt-2"><strong>Instrucciones:</strong> {{ content.instructions }}</p>
        <p class="mt-2"><strong>Tipo de contenido:</strong> {{ content.content_type }}</p>
        
        <!-- Multimedia -->
        <div v-if="content.multimedia" class="mt-2">
          <h3 class="font-semibold">Multimedia:</h3>
          <div v-for="(media, index) in content.multimedia" :key="index">
            <p>Tipo: {{ media.media_type }}</p>
            <p>URL: {{ media.url }}</p>
          </div>
        </div>

        <!-- Renderizar componentes específicos según el tipo -->
        <div class="task-container">
          <!-- Multiple Choice -->
          <MultipleChoiceStudent 
            v-if="content.content_type === 'multiple_choice'" 
            :content="content" 
          />
          
          <!-- True or False -->
          <TrueOrFalseStudent 
            v-if="content.content_type === 'true_false'" 
            :content="content"
          />

          <!-- Word Bank - Nuevo componente -->
          <WordBanckStudent 
            v-if="content.content_type === 'word_bank'" 
            :content="content"
          />

          <!-- Fill Gaps -->
          <FillGapsStudents 
            v-if="content.content_type === 'fill_gaps'" 
            :content="content"
          />

          <!-- Category -->
          <CategoryStudent 
            v-if="content.content_type === 'category'" 
            :content="content"
          />

          <!-- Text Matching -->
          <TextMatchingStudent 
            v-if="content.content_type === 'matching'" 
            :content="content"
          />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useClassContents } from "~/composables/useClassContents";
import MultipleChoiceStudent from "~/components/organisim/templatesUsers/students/taskStudents/MultipleChoiceStudent.vue";
import TrueOrFalseStudent from "~/components/organisim/templatesUsers/students/taskStudents/TrueOrFalseStudent.vue";
import WordBanckStudent from "~/components/organisim/templatesUsers/students/taskStudents/WordBanckStudent.vue";
import FillGapsStudents from "~/components/organisim/templatesUsers/students/taskStudents/FillGapsStudents.vue";
import CategoryStudent from "~/components/organisim/templatesUsers/students/taskStudents/CategoryStudent.vue";
import TextMatchingStudent from "~/components/organisim/templatesUsers/students/taskStudents/TextMatchingStudent.vue";

const route = useRoute();
const classId = route.params.classId as string;
const { classContents, isLoading, error } = useClassContents(classId);

// Logs para debugging
console.log('Clase ID:', classId);
console.log('Estado de carga:', isLoading.value);
console.log('Contenido de la clase:', classContents.value);

// Función para verificar la estructura del contenido
const logContentStructure = (content) => {
  if (content && content.content_type === 'true_or_false') {
    console.log('Estructura TrueOrFalse:', {
      id: content.id,
      type: content.content_type,
      questionCount: content.content_details?.questions?.length || 0,
      questions: content.content_details?.questions
    });
  }
};

// Observar los cambios en classContents
watch(() => classContents.value, (newContents) => {
  if (newContents?.data) {
    newContents.data.forEach(content => logContentStructure(content));
  }
}, { deep: true });
</script>

<style scoped>
.task-container {
  margin-top: 1rem;
}

.class-content-item {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
