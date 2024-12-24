<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <p class="text-fuscous-gray-600">Cargando contenido...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="text-red-500 flex justify-center items-center mt-4">
      <p>Error: {{ error.message }}</p>
    </div>

    <!-- Lista de contenidos -->
    <div v-else-if="classContents?.data?.length > 0" class="space-y-6">
      <div v-for="content in classContents.data" :key="content.id" 
           class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-fuscous-gray-950">
            {{ content.tittle }}
          </h3>
          <span class="bg-tarawera-100 text-tarawera-800 px-3 py-1 rounded-full text-sm">
            {{ formatContentType(content.content_type) }}
          </span>
        </div>

        <!-- Instrucciones -->
        <p v-if="content.instructions" class="text-fuscous-gray-600 mb-4">
          {{ content.instructions }}
        </p>

        <!-- Detalles del contenido según el tipo -->
        <div v-if="content.content_details" class="mb-4">
          <!-- Opción múltiple -->
          <div v-if="content.content_type === 'multiple_choice'" class="space-y-4">
            <div v-for="(question, index) in content.content_details" :key="index" class="border-l-4 border-tarawera-500 pl-4">
              <p class="font-medium mb-2">{{ question.question }}</p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="answer in question.answers" :key="answer.text" 
                    :class="{'text-green-600': answer.is_correct}">
                  {{ answer.text }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Bloque de texto -->
          <div v-else-if="content.content_type === 'text_block'" class="prose max-w-none">
            <div v-for="(value, key) in content.content_details" :key="key">
              <p><strong>{{ key }}:</strong> {{ value }}</p>
            </div>
          </div>
        </div>

        <!-- Multimedia -->
        <div v-if="content.multimedia" class="space-y-4">
          <div v-for="(media, index) in content.multimedia" :key="index" class="border rounded-lg p-4">
            <!-- Imagen -->
            <img v-if="media.media_type === 'image'" :src="media.file" 
                 :alt="media.description || 'Imagen'" class="rounded-lg max-w-full h-auto" />
            
            <!-- Video -->
            <video v-if="media.media_type === 'video'" controls class="w-full rounded-lg">
              <source :src="media.file" type="video/mp4">
              Tu navegador no soporta el elemento de video.
            </video>

            <!-- Audio -->
            <audio v-if="media.media_type === 'audio'" controls class="w-full">
              <source :src="media.file" type="audio/mpeg">
              Tu navegador no soporta el elemento de audio.
            </audio>

            <!-- Descripción del medio -->
            <p v-if="media.description" class="mt-2 text-sm text-fuscous-gray-600">
              {{ media.description }}
            </p>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="mt-4 text-sm text-fuscous-gray-500">
          <p v-if="content.video_transcription" class="mb-2">
            <strong>Transcripción del video:</strong> {{ content.video_transcription }}
          </p>
          <p v-if="content.audio_transcription" class="mb-2">
            <strong>Transcripción del audio:</strong> {{ content.audio_transcription }}
          </p>
          <p class="mb-2">
            <strong>Fecha de creación:</strong> {{ formatDate(content.created_at) }}
          </p>
        </div>

        <!-- Botón de acción -->
        <button 
          @click="handleStartActivity(content)"
          class="mt-4 bg-tarawera-600 hover:bg-tarawera-700 text-white px-4 py-2 rounded-lg transition-colors">
          {{ getActivityButtonText(content.content_type) }}
        </button>
      </div>
    </div>

    <!-- Sin contenido -->
    <div v-else class="text-center text-fuscous-gray-600 mt-8">
      <p>No hay contenido disponible para esta clase.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import axiosInstance from '~/services/axios.config';
import { apiRoutes } from '~/services/routes.api';

const route = useRoute();
const classId = route.params.classId;

// Consulta para obtener los contenidos
const { data: classContents, isLoading, error } = useQuery({
  queryKey: ['class-contents', classId],
  queryFn: async () => {
    const response = await axiosInstance.get(
      `${apiRoutes.classContent}?class_id=${classId}`
    );
    return response.data;
  }
});

// Formatear el tipo de contenido
const formatContentType = (type: string) => {
  const types: { [key: string]: string } = {
    'multiple_choice': 'Opción Múltiple',
    'text_block': 'Bloque de Texto',
    'video': 'Video',
    'audio': 'Audio',
    // Añade más tipos según necesites
  };
  return types[type] || type;
};

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Obtener el texto del botón según el tipo
const getActivityButtonText = (contentType: string) => {
  const buttonTexts: { [key: string]: string } = {
    'multiple_choice': 'Iniciar cuestionario',
    'text_block': 'Leer contenido',
    'video': 'Ver video',
    'audio': 'Escuchar audio'
    // Añade más tipos según necesites
  };
  return buttonTexts[contentType] || 'Iniciar actividad';
};

// Manejar el inicio de una actividad
const handleStartActivity = (content: any) => {
  console.log('Iniciando actividad:', content);
  // Implementa la lógica necesaria según el tipo de actividad
};
</script>