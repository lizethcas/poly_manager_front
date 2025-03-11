<!-- client_2/poly_manager_front/components/AgendaForm.vue -->
<template>
    <div class="agenda-form">
      <h3>Crear Nueva Agenda</h3>
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-group">
          <label for="title">Título:</label>
          <input 
            type="text" 
            id="title"
            v-model="form.title" 
            required 
            placeholder="Ej: Clase de inglés básico"
          />
        </div>
  
        <div class="form-group">
          <label for="date">Fecha:</label>
          <input 
            type="date" 
            id="date"
            v-model="form.date" 
            required 
            :min="minDate"
          />
        </div>
  
        <div class="form-group">
          <label for="start_time">Hora de inicio:</label>
          <input 
            type="time" 
            id="start_time"
            v-model="form.start_time" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="end_time">Hora de fin:</label>
          <input 
            type="time" 
            id="end_time"
            v-model="form.end_time" 
            required 
          />
        </div>
  
        <div class="form-group">
          <label for="available">Disponible:</label>
          <input 
            type="checkbox" 
            id="available"
            v-model="form.available" 
          />
        </div>
  
        <div class="form-group">
          <label for="description">Descripción:</label>
          <textarea 
            id="description"
            v-model="form.description" 
            rows="3"
            placeholder="Descripción de la agenda"
          ></textarea>
        </div>
  
        <div class="form-group">
          <label for="max_participants">Número máximo de participantes:</label>
          <input 
            type="number" 
            id="max_participants"
            v-model="form.max_participants" 
            required 
            min="1"
            placeholder="Ej: 10"
          />
        </div>
  
        <div class="form-group">
          <label for="category">Categoría:</label>
          <select id="category" v-model="form.category" required>
            <option value="tutoring">Tutoria</option>
            <option value="meeting">Reunión</option>
            <option value="workshop">Taller</option>
            <option value="webinar">Webinar</option>
            <option value="other">Otro</option>
          </select>
        </div>
  
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Creando...' : 'Crear Agenda' }}
        </button>
  
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineEmits } from 'vue';
  
  // Define los eventos que puede emitir este componente
  const emit = defineEmits(['agendaCreated']);
  
  const isLoading = ref(false);
  const error = ref('');
  const success = ref('');
  
  const form = ref({
    title: '',
    date: '',
    start_time: '',
    end_time: '',
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
  
  const calculateDuration = () => {
    const startTime = form.value.start_time;
    const endTime = form.value.end_time;
  
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60); // Duración en minutos
      form.value.duration = duration > 0 ? duration : 0; // Asegúrate de que la duración no sea negativa
    } else {
      form.value.duration = null; // Si no hay horas, establece la duración como nula
    }
  };
  
  const submitForm = async () => {
    try {
      isLoading.value = true;
      error.value = '';
      success.value = '';
  
      calculateDuration(); // Llama a la función para calcular la duración
      
      // Crear una copia del formulario para modificarla antes de enviar
      const formData = { ...form.value };
      
      // Asignar start_time al campo time que espera el backend
      formData.time = formData.start_time;
      
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
  
      // Limpiar el formulario
      form.value = {
        title: '',
        date: '',
        start_time: '',
        end_time: '',
        available: true,
        description: '',
        admin: 1,
        max_participants: 1,
        category: 'other',
      };
  
      success.value = 'Agenda creada exitosamente';
      
      // Emitir evento para actualizar el calendario
      emit('agendaCreated');
  
    } catch (err) {
      console.error('Error completo:', err);
      error.value = err instanceof Error ? err.message : 'Error al crear la agenda';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .agenda-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  label {
    font-weight: bold;
    color: #333;
  }
  
  input[type="text"],
  input[type="date"],
  input[type="time"],
  textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .error-message {
    color: #dc3545;
    padding: 10px;
    border-radius: 4px;
    background-color: #f8d7da;
  }
  
  .success-message {
    color: #28a745;
    padding: 10px;
    border-radius: 4px;
    background-color: #d4edda;
  }
  
  input[type="number"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
  }
  </style>