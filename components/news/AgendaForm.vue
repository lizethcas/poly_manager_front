<!-- client_2/poly_manager_front/components/AgendaForm.vue -->
<template>
  <div v-if="isOpen" class="form-agenda overflow-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
      <!-- Header del modal -->
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Crear Nueva Agenda</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <Icon name="mdi:close" class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Formulario -->
      <form @submit.prevent="submitForm" class="p-4 space-y-4">
        <!-- Título -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ej: Clase de inglés básico"
            required
          />
        </div>
        
        <!-- Fecha -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
          <input 
            type="date" 
            id="date" 
            v-model="form.date" 
            :min="minDate"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        
        <!-- Horas (inicio y fin) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="start_time" class="block text-sm font-medium text-gray-700">Hora inicio</label>
            <input 
              type="time" 
              id="start_time" 
              v-model="form.start_time" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">Duración</label>
            <select 
              id="duration" 
              v-model="form.duration" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
            </select>
          </div>
        </div>
        
        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            rows="3" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Descripción de la agenda"
          ></textarea>
        </div>

        <!-- Disponibilidad -->
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="available" 
            v-model="form.available" 
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="available" class="ml-2 block text-sm text-gray-700">Disponible para inscripción</label>
        </div>
        
        <!-- Número de participantes -->
        <div>
          <label for="max_participants" class="block text-sm font-medium text-gray-700">Número máximo de participantes</label>
          <input 
            type="number" 
            id="max_participants" 
            v-model="form.max_participants" 
            min="1" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ej: 10"
            required
          />
        </div>
        
        <!-- Categoría -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
          <select 
            id="category" 
            v-model="form.category" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="tutoring">Tutoría</option>
            <option value="meeting">Reunión</option>
            <option value="workshop">Taller</option>
            <option value="webinar">Webinar</option>
            <option value="other">Otro</option>
          </select>
        </div>
        
        <!-- Mensajes de error/éxito -->
        <div v-if="error" class="text-red-600 text-sm p-2 bg-red-50 rounded-md">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-sm p-2 bg-green-50 rounded-md">{{ success }}</div>
        
        <!-- Botones de acción -->
        <div class="pt-4 border-t flex justify-end space-x-2">
          <button 
            type="button"
            @click="closeModal" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
          >
            {{ isLoading ? 'Creando...' : 'Crear Agenda' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue';

// Props para controlar la visibilidad del modal
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// Define los eventos que puede emitir este componente
const emit = defineEmits(['agendaCreated', 'close']);

const isLoading = ref(false);
const error = ref('');
const success = ref('');

const form = ref({
  title: '',
  date: '',
  start_time: '',
  duration: '30',
  available: true,
  description: '',
  admin: 1,
  max_participants: 1,
  category: 'other',
});

// Asegura que no se puedan crear agendas en fechas pasadas
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const closeModal = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  form.value = {
    title: '',
    date: '',
    start_time: '',
    duration: '30',
    available: true,
    description: '',
    admin: 1,
    max_participants: 1,
    category: 'other',
  };
  error.value = '';
  success.value = '';
};

const submitForm = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    success.value = '';

    // Crear una copia del formulario para modificarla antes de enviar
    const formData = { ...form.value };
    
    // Asignar start_time al campo time que espera el backend
    formData.time = formData.start_time;
    
    // Asegurarse de que duration sea un número
    formData.duration = parseInt(formData.duration);
    
    console.log('Enviando datos:', formData);
    
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
    }
    
    // Asegúrate de que esta URL coincida exactamente con la configuración de Django
    const response = await fetch('http://localhost:8000/dashboard/api/admin-agenda/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Añadir el token de autenticación
      },
      body: JSON.stringify(formData),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || 'Error al crear la agenda');
    }

    const data = await response.json();
    console.log('Respuesta exitosa:', data);

    success.value = 'Agenda creada exitosamente';
    
    // Emitir evento para actualizar el calendario y cerrar el modal
    emit('agendaCreated');
    
    // Esperar un momento para mostrar el mensaje de éxito antes de cerrar
    setTimeout(() => {
      resetForm();
      emit('close');
    }, 1500);

  } catch (err) {
    console.error('Error completo:', err);
    error.value = err instanceof Error ? err.message : 'Error al crear la agenda';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>

.form-agenda{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

</style>
