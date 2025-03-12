<template>
  <div class="calendar-container bg-white rounded-lg shadow-sm border border-gray-200 max-w-6xl mx-auto">
    <!-- Filtros de eventos con nuevo estilo -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <label for="eventFilter" class="text-sm font-medium text-gray-600">Ver eventos:</label>
        <div class="flex gap-2">
          <button 
            class="py-1 px-3 rounded-md text-sm focus:outline-none"
            :class="activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="setFilter('all')"
          >
            Todos los eventos
          </button>
          <button 
            class="py-1 px-3 rounded-md text-sm focus:outline-none"
            :class="activeFilter === 'registered' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="setFilter('registered')"
          >
            Mis eventos
          </button>
          <button 
            class="py-1 px-3 rounded-md text-sm focus:outline-none"
            :class="activeFilter === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="setFilter('available')"
          >
            Disponibles
          </button>
        </div>
      </div>
    </div>

    <!-- Header con navegación de semana -->
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <button
          @click="prevWeek"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 class="text-base font-medium text-gray-700">{{ weekRange }}</h2>
        <button
          @click="nextWeek"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div class="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded">
        GMT-05
      </div>
    </div>

    <!-- Calendario principal -->
    <div class="calendar-grid">
      <!-- Columna de horas -->
      <div class="time-labels bg-gray-50 border-r border-gray-200">
        <div class="timezone h-12 flex items-center justify-center border-b border-gray-200 text-xs text-gray-500">
          Zona horaria
        </div>
        <div 
          v-for="hour in filteredHours" 
          :key="hour"
          class="time-slot h-16 flex items-start justify-end pr-2 text-xs text-gray-500 border-b border-gray-200"
        >
          <span class="mt-1">{{ hour }}:00</span>
        </div>
      </div>
      
      <!-- Grid principal -->
      <div class="main-grid w-full overflow-x-auto relative">
        <!-- Encabezados de días -->
        <div class="day-headers grid grid-cols-7 h-12 border-b border-gray-200">
          <div 
            v-for="(date, index) in weekDates" 
            :key="index"
            class="day-header flex flex-col items-center justify-center border-r border-gray-200 last:border-r-0"
            :class="{ 'bg-blue-50': isToday(date) }"
          >
            <div class="day-name text-xs text-gray-500">{{ days[date.getDay()] }}</div>
            <div class="day-number text-sm font-semibold text-gray-700">{{ date.getDate() }}</div>
          </div>
        </div>
        
        <!-- Celdas de horarios -->
        <div class="time-grid">
          <div 
            v-for="hour in filteredHours" 
            :key="hour"
            class="time-row grid grid-cols-7 h-16"
          >
            <div 
              v-for="(date, index) in weekDates" 
              :key="`${date}-${hour}`"
              class="time-cell relative border-b border-r border-gray-200 last:border-r-0"
              :class="{ 
                'bg-blue-50/30': isToday(date), 
                'bg-gray-50/70': hour >= 14 && hour <= 18,
                'current-time-indicator': isCurrentTimeSlot(date, hour)
              }"
            >
              <!-- Eventos en esta celda -->
              <div 
                v-for="event in getEventsForTimeSlot(date, hour)" 
                :key="event.id"
                class="event absolute z-10 rounded-md shadow-sm p-1.5 overflow-hidden"
                :style="calculateEventStyle(event)"
                :class="{ 'available': event.available, 'registered': event.is_registered }"
                @click="showEventDetails(event)"
              >
                <div class="event-title text-xs font-medium truncate">{{ event.title }}</div>
                <div class="event-time text-[10px] text-white/90 truncate">{{ formatTime(event.time) }} - {{ calculateEndTime(event) }}</div>
                <div class="event-spots text-[10px] truncate">
                  {{ event.spots_available }}/{{ event.max_participants || event.capacity }} cupos
                </div>
                
                <!-- Insignia de inscrito -->
                <div v-if="event.is_registered" class="absolute top-1 right-1 bg-yellow-500 text-[9px] text-black font-medium px-1 rounded">
                  Inscrito
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del evento -->
    <div v-if="selectedEvent" class="event-modal-backdrop" @click="closeEventDetails">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Header del modal -->
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Detalles del evento</h3>
          <button @click="closeEventDetails" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-4 space-y-4">
          <!-- Título y categoría -->
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ selectedEvent.title }}</h2>
            <div class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
              :style="{ backgroundColor: getCategoryLight(selectedEvent.category), color: getCategoryText(selectedEvent.category) }">
              {{ getCategoryName(selectedEvent.category) }}
            </div>
            <div v-if="selectedEvent.is_registered" class="mt-1 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
              Inscrito
            </div>
          </div>
          
          <!-- Fecha y hora -->
          <div class="flex items-start space-x-3">
            <svg class="h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(selectedEvent.date) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatTime(selectedEvent.time) }} - {{ calculateEndTime(selectedEvent) }} 
                ({{ selectedEvent.duration }} minutos)
              </p>
            </div>
          </div>
          
          <!-- Cupos -->
          <div class="flex items-start space-x-3">
            <svg class="h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ selectedEvent.spots_available }}/{{ selectedEvent.max_participants || selectedEvent.capacity }} cupos disponibles
              </p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-blue-500 h-2 rounded-full" 
                  :style="{width: `${(1 - (selectedEvent.spots_available / (selectedEvent.max_participants || selectedEvent.capacity))) * 100}%`}"></div>
              </div>
            </div>
          </div>
          
          <!-- Descripción -->
          <div class="flex items-start space-x-3">
            <svg class="h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">Descripción</p>
              <p class="text-sm text-gray-600 mt-1">{{ selectedEvent.description || 'Sin descripción' }}</p>
            </div>
          </div>
          
          <!-- Status -->
          <div class="flex items-start space-x-3">
            <svg class="h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">Estado</p>
              <div class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                :class="selectedEvent.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ selectedEvent.available ? 'Disponible' : 'No disponible' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer del modal -->
        <div class="p-4 border-t flex justify-end space-x-2">
          <button @click="closeEventDetails" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cerrar
          </button>
          <button 
            v-if="!selectedEvent.is_registered && selectedEvent.available && selectedEvent.spots_available > 0"
            @click="registerForEvent(selectedEvent)"
            class="px-4 py-2 bg-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-600">
            Inscribirme
          </button>
          <button 
            v-if="selectedEvent.is_registered"
            @click="cancelRegistration(selectedEvent)"
            class="px-4 py-2 bg-red-500 rounded-md text-sm font-medium text-white hover:bg-red-600">
            Cancelar inscripción
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  
  interface Event {
    id: number;
    title: string;
    description?: string;
    category: string;
    available: boolean;
    date: string;
    time: string;
    duration: number;
    spots_available: number;
    is_registered?: boolean;
  }
  
  const currentDate = ref(new Date());
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const events = ref<Event[]>([]);
  const isLoading = ref(false);
  const error = ref('');
  const selectedEvent = ref<Event | null>(null);
  
  // Filtrar horas entre 7 AM y 6 PM
  const filteredHours = Array.from({ length: 12 }, (_, i) => i + 7); // Horas de 7 a 18
  
  // Obtener fechas de la semana
  const weekDates = computed(() => {
    const dates = [];
    const firstDay = new Date(currentDate.value);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay()); // Comenzar desde domingo
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      dates.push(date);
    }
    return dates;
  });
  
  // Rango de la semana para mostrar en el encabezado
  const weekRange = computed(() => {
    const firstDate = weekDates.value[0];
    const lastDate = weekDates.value[6];
    return `${firstDate.toLocaleDateString('es', { month: 'long', day: 'numeric' })} - ${lastDate.toLocaleDateString('es', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  });
  
  // Navegación
  const prevWeek = () => {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() - 7);
    currentDate.value = newDate;
    loadEvents();
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() + 7);
    currentDate.value = newDate;
    loadEvents();
  };
  
  // Verificar si es la hora actual
  const isCurrentTimeSlot = (date: Date, hour: number) => {
    const now = new Date();
    return date.getDate() === now.getDate() && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear() && 
           hour === now.getHours();
  };
  
  // Verificar si es hoy
  const isToday = (date: Date) => {
    const now = new Date();
    return date.getDate() === now.getDate() && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  };
  
  // Cargar eventos desde el backend
  const loadEvents = async () => {
    try {
      isLoading.value = true;
      error.value = '';
      
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      
      // Calcular fechas para filtrar eventos
      const startDate = weekDates.value[0].toISOString().split('T')[0];
      const endDate = weekDates.value[6].toISOString().split('T')[0];
      
      console.log('Cargando eventos con token:', token.substring(0, 10) + '...');
      
      // Hacer la petición al backend para obtener todos los eventos
      const response = await fetch(`http://localhost:8000/dashboard/api/admin-agenda/?start_date=${startDate}&end_date=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al cargar los eventos');
      }
      
      const data = await response.json();
      console.log('Eventos cargados:', data);
      
      // Obtener los eventos en los que el estudiante está inscrito
      const registeredResponse = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!registeredResponse.ok) {
        console.error('Error al cargar eventos registrados:', await registeredResponse.text());
      } else {
        const registeredData = await registeredResponse.json();
        console.log('Eventos registrados:', registeredData);
        
        // Crear un conjunto con los IDs de los eventos registrados
        const registeredEventIds = new Set(
          registeredData
            .filter((reg: any) => reg.status !== 'cancelled')
            .map((reg: any) => reg.admin_agenda)
        );
        
        // Marcar los eventos en los que el estudiante está inscrito
        data.forEach((event: any) => {
          event.is_registered = registeredEventIds.has(event.id);
        });
      }
      
      events.value = data;
      
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Formatear hora (HH:MM)
  const formatTime = (timeString: string): string => {
    return timeString;
  };
  
  // Calcular hora de fin basada en la hora de inicio y la duración
  const calculateEndTime = (event: Event): string => {
    const [hours, minutes] = event.time.split(':').map(Number);
    
    // Crear una fecha base y añadir la hora de inicio
    const startTime = new Date(1970, 0, 1, hours, minutes);
    
    // Añadir la duración en minutos
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    
    // Formatear la hora de fin
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  };
  
  const activeFilter = ref('all'); // Filtro activo: 'all', 'registered', 'available'
  
  // Función para cambiar el filtro activo
  const setFilter = (filter: string) => {
    activeFilter.value = filter;
  };
  
  // Obtener eventos para una celda específica (fecha y hora) con filtro
  const getEventsForTimeSlot = (date: Date, hour: number): Event[] => {
    // Convertir la fecha a formato YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // Filtrar eventos que ocurren en esta fecha y hora
    let filteredEvents = events.value.filter(event => {
      // Verificar si el evento es para esta fecha
      if (event.date !== dateString) return false;
      
      // Obtener la hora de inicio del evento
      const eventHour = parseInt(event.time.split(':')[0]);
      
      // Verificar si el evento comienza en esta hora
      return eventHour === hour;
    });
    
    // Aplicar filtro adicional según la selección del usuario
    if (activeFilter.value === 'registered') {
      filteredEvents = filteredEvents.filter(event => event.is_registered);
    } else if (activeFilter.value === 'available') {
      filteredEvents = filteredEvents.filter(event => event.available && event.spots_available > 0 && !event.is_registered);
    }
    
    return filteredEvents;
  };
  
  // Definir colores para cada categoría
  const categoryColors: { [key: string]: string } = {
    tutoring: '#4CAF50',  // Verde
    meeting: '#2196F3',   // Azul
    workshop: '#FF9800',  // Naranja
    webinar: '#9C27B0',   // Púrpura
    other: '#607D8B',     // Gris
  };
  
  // Calcular el estilo del evento basado en su duración y categoría
  const calculateEventStyle = (event: Event) => {
    // Calcular altura basada en la duración (1 hora = 60px)
    const heightInPixels = (event.duration / 60) * 60;
    
    // Obtener el color de la categoría
    let backgroundColor = categoryColors[event.category] || '#607D8B';
    
    // Si el estudiante está inscrito, usar un estilo diferente
    if (event.is_registered) {
      backgroundColor = '#8E24AA'; // Color púrpura para eventos inscritos
    }
    
    return {
      height: `${heightInPixels}px`,
      backgroundColor,
      border: event.is_registered ? '2px solid #FFC107' : 'none', // Borde amarillo para eventos inscritos
    };
  };
  
  // Función para mostrar detalles del evento
  const showEventDetails = (event: Event) => {
    selectedEvent.value = event;
  };

  // Función para cerrar el modal
  const closeEventDetails = () => {
    selectedEvent.value = null;
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (category: string): string => {
    const categories: { [key: string]: string } = {
      'tutoring': 'Tutoría',
      'meeting': 'Reunión',
      'workshop': 'Taller',
      'webinar': 'Webinar',
      'other': 'Otro'
    };
    return categories[category] || category;
  };
  
  // Función para mostrar alertas
  const showAlert = (title: string, message: string, type: string = 'info') => {
    // Si estamos usando SweetAlert2
    if (typeof window !== 'undefined' && 'Swal' in window) {
      (window as any).Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonText: 'Aceptar'
      });
    } else {
      // Fallback a alert nativo
      alert(`${title}: ${message}`);
    }
  };
  
  // Función para inscribir al estudiante en un evento
  const registerForEvent = async (event: Event) => {
    try {
      console.log("Intentando registrar para el evento:", event);
      
      // Verificar si hay token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
        return;
      }
      
      // Verificar si hay cupos disponibles
      if (event.spots_available <= 0) {
        showAlert('Sin cupos', 'No hay cupos disponibles para este evento.', 'warning');
        return;
      }
      
      // Mostrar mensaje de carga
      showAlert('Procesando', 'Registrando en el evento...', 'info');
      
      // Primero, verificar nuevamente los cupos disponibles (podría haber cambiado)
      const checkResponse = await fetch(`http://localhost:8000/dashboard/api/admin-agenda/${event.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (checkResponse.ok) {
        const updatedEvent = await checkResponse.json();
        console.log("Información actualizada del evento:", updatedEvent);
        
        if (updatedEvent.spots_available <= 0) {
          showAlert('Sin cupos', 'Lo sentimos, los cupos disponibles se han agotado mientras navegabas.', 'warning');
          await loadEvents(); // Recargar para actualizar la UI
          return;
        }
      }
      
      // Verificar si ya existe una inscripción previa (incluso cancelada)
      const registrationsResponse = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!registrationsResponse.ok) {
        throw new Error('Error al obtener las inscripciones');
      }
      
      const registrations = await registrationsResponse.json();
      const existingRegistration = registrations.find((r: any) => r.admin_agenda === event.id);
      
      let response;
      
      if (existingRegistration) {
        console.log("Encontrada inscripción previa:", existingRegistration);
        
        // Si existe una inscripción previa, actualizar su estado a 'registered'
        response = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/${existingRegistration.id}/update_status/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'registered'
          })
        });
      } else {
        // Si no existe, crear una nueva inscripción
        response = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            admin_agenda: event.id
          })
        });
      }
      
      // Procesar la respuesta
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { detail: await response.text() };
      }
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 400) {
          if (data.detail && typeof data.detail === 'string') {
            showAlert('Error', data.detail, 'error');
          } else if (data.detail && typeof data.detail === 'object') {
            // Si es un objeto con múltiples errores
            const errorMessages = Object.values(data.detail).flat().join(', ');
            showAlert('Error', errorMessages, 'error');
          } else {
            showAlert('Error', 'Error en la solicitud. Verifica los datos.', 'error');
          }
        } else if (response.status === 401) {
          showAlert('No autorizado', 'No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.', 'error');
        } else if (response.status === 500) {
          showAlert('Error del servidor', 'Ha ocurrido un error en el servidor. Por favor, intenta más tarde.', 'error');
        } else {
          showAlert('Error', `Error al registrar: ${data.detail || 'Error desconocido'}`, 'error');
        }
        
        // Recargar eventos para tener datos actualizados
        await loadEvents();
        return;
      }
      
      // Registro exitoso
      console.log("Registro exitoso:", data);
      
      // Recargar eventos para actualizar la información
      await loadEvents();
      
      // Mostrar mensaje de éxito
      showAlert('¡Éxito!', 'Te has registrado correctamente en el evento.', 'success');
      
      // Cerrar el modal
      closeEventDetails();
      
    } catch (error: any) {
      console.error("Error al registrar para el evento:", error);
      showAlert('Error', `Error al registrar: ${error.message || 'Error desconocido'}`, 'error');
      
      // Recargar eventos para tener datos actualizados
      await loadEvents();
    }
  };
  
  // Función para cancelar la inscripción a un evento
  const cancelRegistration = async (event: Event) => {
    try {
      console.log("Intentando cancelar inscripción para el evento:", event);
      
      // Verificar si hay token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
        return;
      }
      
      // Mostrar mensaje de carga
      showAlert('Procesando', 'Cancelando inscripción...', 'info');
      
      // Primero necesitamos obtener el ID de la inscripción
      const registrationsResponse = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!registrationsResponse.ok) {
        throw new Error('Error al obtener las inscripciones');
      }
      
      const registrations = await registrationsResponse.json();
      const registration = registrations.find(r => 
        r.admin_agenda === event.id && r.status !== 'cancelled'
      );
      
      if (!registration) {
        showAlert('Error', 'No se encontró la inscripción para este evento', 'error');
        return;
      }
      
      // Ahora actualizamos el estado a 'cancelled'
      const response = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/${registration.id}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      });
      
      // Procesar la respuesta
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { detail: await response.text() };
      }
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 400) {
          if (data.detail && typeof data.detail === 'string') {
            showAlert('Error', data.detail, 'error');
          } else if (data.detail && typeof data.detail === 'object') {
            // Si es un objeto con múltiples errores
            const errorMessages = Object.values(data.detail).flat().join(', ');
            showAlert('Error', errorMessages, 'error');
          } else {
            showAlert('Error', 'Error en la solicitud. Verifica los datos.', 'error');
          }
        } else if (response.status === 401) {
          showAlert('No autorizado', 'No tienes permiso para realizar esta acción. Por favor, inicia sesión nuevamente.', 'error');
        } else if (response.status === 500) {
          showAlert('Error del servidor', 'Ha ocurrido un error en el servidor. Por favor, intenta más tarde.', 'error');
        } else {
          showAlert('Error', `Error al cancelar inscripción: ${data.detail || 'Error desconocido'}`, 'error');
        }
        return;
      }
      
      // Cancelación exitosa
      console.log("Cancelación exitosa:", data);
      
      // Actualizar el evento en la lista local
      const eventIndex = events.value.findIndex(e => e.id === event.id);
      if (eventIndex !== -1) {
        events.value[eventIndex].spots_available += 1;
        events.value[eventIndex].is_registered = false;
      }
      
      // Recargar eventos para actualizar la información
      await loadEvents();
      
      // Mostrar mensaje de éxito
      showAlert('¡Éxito!', 'Has cancelado tu inscripción al evento.', 'success');
      
      // Cerrar el modal
      closeEventDetails();
      
    } catch (error: any) {
      console.error("Error al cancelar inscripción:", error);
      showAlert('Error', `Error al cancelar inscripción: ${error.message || 'Error desconocido'}`, 'error');
    }
  };

  // Funciones auxiliares para estilos
const getCategoryText = (category) => {
  const colors = {
    tutoring: '#2e7d32', // Verde oscuro
    meeting: '#1565c0', // Azul oscuro
    workshop: '#e65100', // Naranja oscuro
    webinar: '#6a1b9a', // Púrpura oscuro
    other: '#455a64', // Gris oscuro
  };
  return colors[category] || '#455a64';
};

const getCategoryLight = (category) => {
  const colors = {
    tutoring: '#e8f5e9', // Verde claro
    meeting: '#e3f2fd', // Azul claro
    workshop: '#fff3e0', // Naranja claro
    webinar: '#f3e5f5', // Púrpura claro
    other: '#eceff1', // Gris claro
  };
  return colors[category] || '#eceff1';
};
  
  // Cargar eventos al montar el componente
  onMounted(() => {
    loadEvents();
  });
  </script>

<style scoped>

.event-modal-backdrop {
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
.calendar-container {
  background: white;
  color: #000;
}

.calendar-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0;
  background-color: white;
}

.time-labels {
  background: #f9fafb;
}

.main-grid {
  overflow-x: auto;
  overflow-y: hidden;
}

.time-grid {
  min-width: 100%;
}

.time-cell {
  position: relative;
}

/* Línea para la hora actual */
.current-time-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef4444;
  z-index: 5;
}

/* Estilos para los eventos */
.event {
  width: calc(100% - 6px);
  left: 3px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 20;
}

.event.available {
  opacity: 1;
}

.event:not(.available) {
  opacity: 0.7;
}

.event.registered {
  box-shadow: 0 0 0 2px #fde047;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: 60px 1fr;
  }
}
</style>
