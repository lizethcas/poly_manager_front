<template>
    <div class="calendar">
      <div class="header">
        <button @click="prevWeek">Anterior</button>
        <h2>{{ weekRange }}</h2>
        <button @click="nextWeek">Siguiente</button>
      </div>
      
      <!-- Filtros de eventos -->
      <div class="event-filters">
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          Todos los eventos
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'registered' }"
          @click="setFilter('registered')"
        >
          Mis eventos
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'available' }"
          @click="setFilter('available')"
        >
          Disponibles
        </button>
      </div>
      
      <div class="calendar-grid">
        <!-- Columna de horas -->
        <div class="time-labels">
          <div class="timezone">GMT-05</div>
          <div class="time-slot" v-for="hour in filteredHours" :key="hour">
            {{ hour }}:00
          </div>
        </div>
        
        <!-- Grid principal -->
        <div class="main-grid">
          <!-- Encabezados de días -->
          <div class="day-headers">
            <div class="day-header" v-for="(date, index) in weekDates" :key="index">
              <div class="day-name">{{ days[date.getDay()] }}</div>
              <div class="day-number">{{ date.getDate() }}</div>
            </div>
          </div>
          
          <!-- Celdas de horarios -->
          <div class="time-grid">
            <div class="time-row" v-for="hour in filteredHours" :key="hour">
              <div 
                class="time-cell" 
                v-for="(date, index) in weekDates" 
                :key="`${date}-${hour}`"
                :class="{ 'current-time': isCurrentTimeSlot(date, hour), 'current-day': isToday(date) }"
              >
                <!-- Eventos en esta celda -->
                <div 
                  v-for="event in getEventsForTimeSlot(date, hour)" 
                  :key="event.id"
                  class="event"
                  :style="calculateEventStyle(event)"
                  :class="{ 'available': event.available, 'registered': event.is_registered }"
                  @click="showEventDetails(event)"
                >
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-time">{{ formatTime(event.time) }} - {{ calculateEndTime(event) }}</div>
                  <div v-if="event.is_registered" class="registered-badge">Inscrito</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de detalles del evento -->
      <div v-if="selectedEvent" class="event-modal-overlay" @click="closeEventDetails">
        <div class="event-modal" @click.stop>
          <button class="close-button" @click="closeEventDetails">&times;</button>
          <h3>{{ selectedEvent.title }}</h3>
          <div v-if="selectedEvent.is_registered" class="registered-tag">Inscrito</div>
          <div class="event-details">
            <p><strong>Fecha:</strong> {{ formatDate(selectedEvent.date) }}</p>
            <p><strong>Horario:</strong> {{ formatTime(selectedEvent.time) }} - {{ calculateEndTime(selectedEvent) }}</p>
            <p><strong>Duración:</strong> {{ selectedEvent.duration }} minutos</p>
            <p><strong>Categoría:</strong> {{ getCategoryName(selectedEvent.category) }}</p>
            <p><strong>Estado:</strong> {{ selectedEvent.available ? 'Disponible' : 'No disponible' }}</p>
            <p><strong>Cupos disponibles:</strong> {{ selectedEvent.spots_available }}</p>
            <p v-if="selectedEvent.description"><strong>Descripción:</strong> {{ selectedEvent.description }}</p>
            
            <!-- Botón de inscripción -->
            <button 
              v-if="!selectedEvent.is_registered"
              class="register-button"
              @click="registerForEvent(selectedEvent)"
              :disabled="!selectedEvent.available || selectedEvent.spots_available <= 0"
            >
              {{ selectedEvent.spots_available <= 0 ? 'Sin cupos disponibles' : 'Inscribirse' }}
            </button>
            
            <!-- Botón para cancelar inscripción -->
            <button 
              v-if="selectedEvent.is_registered"
              class="cancel-button"
              @click="cancelRegistration(selectedEvent)"
            >
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
  
  // Cargar eventos al montar el componente
  onMounted(() => {
    loadEvents();
  });
  </script>
  
  <style scoped>
  .calendar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: #fff;
    color: #000;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
  }
  
  .header button {
    padding: 0.5rem 1rem;
    background: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 1px;
    border: 1px solid #333;
  }
  
  .time-labels {
    background: #f0f0f0;
  }
  
  .timezone {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #333;
    font-size: 0.8rem;
  }
  
  .time-slot {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #333;
    font-size: 0.9rem;
  }
  
  .main-grid {
    display: flex;
    flex-direction: column;
  }
  
  .day-headers {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    height: 50px;
    border-bottom: 1px solid #333;
  }
  
  .day-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #333;
    padding: 0.5rem;
  }
  
  .day-name {
    font-size: 0.8rem;
    color: #888;
  }
  
  .day-number {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .time-grid {
    display: flex;
    flex-direction: column;
  }
  
  .time-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    height: 60px;
  }
  
  .time-cell {
    border: 1px solid #333;
    position: relative;
  }
  
  .current-time {
    background-color: rgba(76, 175, 80, 0.1);
  }
  
  .current-day {
    background-color: rgba(173, 216, 230, 0.5);
  }
  
  /* Estilos para los eventos */
  .event {
    position: absolute;
    width: 95%;
    color: white;
    border-radius: 4px;
    padding: 4px;
    overflow: hidden;
    z-index: 10;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .event.available {
    opacity: 1;
  }
  
  .event:not(.available) {
    opacity: 0.7;
  }
  
  .event-title {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .event-time {
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .calendar-grid {
      grid-template-columns: 60px 1fr;
    }
    
    .time-slot {
      font-size: 0.8rem;
    }
    
    .day-name {
      font-size: 0.7rem;
    }
    
    .day-number {
      font-size: 1rem;
    }
    
    .event {
      font-size: 0.7rem;
    }
    
    .event-time {
      font-size: 0.6rem;
    }
  }

  /* Estilos para el modal */
  .event-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .event-modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .close-button:hover {
    color: #333;
  }

  .event-details {
    margin-top: 1rem;
  }

  .event-details p {
    margin: 0.5rem 0;
  }

  .event {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .event:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  /* Estilos para el botón de inscripción */
  .register-button {
    margin-top: 1rem;
    padding: 0.8rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.2s;
  }

  .register-button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .register-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  /* Estilos para el tag de inscripción registrado */
  .registered-tag {
    background-color: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  /* Estilos para el botón de cancelación */
  .cancel-button {
    margin-top: 1rem;
    padding: 0.8rem 1.5rem;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    transition: background-color 0.2s;
  }

  .cancel-button:hover {
    background-color: #d32f2f;
  }

  /* Estilos para eventos registrados */
  .event.registered {
    position: relative;
    box-shadow: 0 0 8px rgba(255, 193, 7, 0.8);
  }

  .registered-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: #FFC107;
    color: #000;
    font-size: 0.6rem;
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: bold;
  }

  .registered-tag {
    display: inline-block;
    background-color: #8E24AA;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  /* Filtros para eventos */
  .event-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .filter-button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .filter-button.active {
    background-color: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }

  .filter-button:hover:not(.active) {
    background-color: #e0e0e0;
  }
  </style>