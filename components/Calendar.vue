<template>
    <div class="calendar">
      <AgendaForm @agendaCreated="loadEvents" />
      
      <!-- Filtro de administradores -->
      <div class="filters">
        <div class="filter-group">
          <label for="adminFilter">Ver eventos de:</label>
          <select id="adminFilter" v-model="selectedAdmin" @change="loadEvents">
            <option value="own">Mis eventos</option>
            <option value="all">Todos los eventos</option>
            <option v-for="admin in admins" :key="admin.id" :value="admin.id">
              {{ admin.user_email }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="header">
        <button @click="prevWeek">Anterior</button>
        <h2>{{ weekRange }}</h2>
        <button @click="nextWeek">Siguiente</button>
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
                  :class="{ 'available': event.available, 'own-event': isOwnEvent(event) }"
                  @click="showEventDetails(event)"
                >
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-time">{{ formatTime(event.time) }} - {{ calculateEndTime(event) }}</div>
                  <div class="event-spots">{{ event.spots_available }}/{{ event.max_participants }} cupos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal de detalles del evento -->
      <div v-if="selectedEvent" class="event-modal-backdrop" @click="closeEventDetails">
        <div class="event-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedEvent.title }}</h3>
            <button class="close-button" @click="closeEventDetails">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Modo visualización -->
            <div v-if="!editMode">
              <div class="event-info">
                <p><strong>Fecha:</strong> {{ formatDate(selectedEvent.date) }}</p>
                <p><strong>Hora:</strong> {{ formatTime(selectedEvent.time) }} - {{ calculateEndTime(selectedEvent) }}</p>
                <p><strong>Duración:</strong> {{ selectedEvent.duration }} minutos</p>
                <p><strong>Categoría:</strong> {{ getCategoryName(selectedEvent.category) }}</p>
                <p><strong>Cupos:</strong> {{ selectedEvent.spots_available }}/{{ selectedEvent.max_participants }}</p>
                <p><strong>Descripción:</strong> {{ selectedEvent.description || 'Sin descripción' }}</p>
                <p><strong>Creado por:</strong> {{ selectedEvent.admin_email }}</p>
              </div>
              
              <div class="participants-section">
                <h4>Participantes inscritos ({{ participants.length }})</h4>
                <div v-if="loadingParticipants" class="loading-participants">
                  Cargando participantes...
                </div>
                <div v-else-if="participants.length === 0" class="no-participants">
                  No hay participantes inscritos en este evento.
                </div>
                <div v-else class="participants-list">
                  <div v-for="participant in participants" :key="participant.id" class="participant-item">
                    <div class="participant-info">
                      <span class="participant-email">{{ participant.participant_email }}</span>
                      <span class="participant-status" :class="participant.status">
                        {{ getStatusName(participant.status) }}
                      </span>
                    </div>
                    <div class="participant-actions">
                      <button 
                        v-if="participant.status !== 'completed'" 
                        @click="updateParticipantStatus(participant.id, 'completed')"
                        class="status-button completed-button"
                      >
                        Marcar como completado
                      </button>
                      <button 
                        v-if="participant.status !== 'cancelled'" 
                        @click="updateParticipantStatus(participant.id, 'cancelled')"
                        class="status-button cancel-button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import AgendaForm from './AgendaForm.vue';
  
  // Definir interfaces para los tipos
  interface Admin {
    id: number;
    user_email: string;
    user_username?: string;
  }
  
  interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    category: string;
    available: boolean;
    max_participants: number;
    spots_available: number;
    admin: number;
    admin_email: string;
  }
  
  interface Participant {
    id: number;
    admin_agenda: number;
    participant: number;
    participant_email: string;
    status: 'pending' | 'registered' | 'cancelled' | 'completed';
    notes?: string;
    registered_at: string;
    updated_at: string;
  }
  
  const currentDate = ref(new Date());
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const events = ref<Event[]>([]);
  const isLoading = ref(false);
  const error = ref('');
  const selectedEvent = ref<Event | null>(null);
  const participants = ref<Participant[]>([]);
  const loadingParticipants = ref(false);
  const admins = ref<Admin[]>([]);
  const selectedAdmin = ref('own'); // 'own', 'all', o ID de un administrador específico
  
  // Variables para la edición de eventos
  const editMode = ref(false);
  const editingEvent = ref<Event | null>(null);
  const isSaving = ref(false);
  const editError = ref('');
  
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
  
  // Verificar si el evento es del administrador actual
  const isOwnEvent = (event: Event) => {
    try {
      console.log("Verificando si el evento es propio:", event);
      
      // Obtener el ID del administrador actual del localStorage
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.log('No hay datos de usuario en localStorage');
        return false;
      }
      
      const userData = JSON.parse(userString);
      console.log('Datos de usuario completos:', userData);
      
      // Verificar si el usuario tiene un teachermodel_id
      if (userData && userData.teachermodel_id) {
        const teacherModelId = userData.teachermodel_id;
        console.log(`Comparando: evento admin=${event.admin}, usuario teachermodel_id=${teacherModelId}`);
        
        // Convertir ambos valores a números para asegurar una comparación correcta
        return Number(event.admin) === Number(teacherModelId);
      }
      
      console.log('El usuario no tiene teachermodel_id');
      return false;
    } catch (error) {
      console.error("Error al verificar si es evento propio:", error);
      return false;
    }
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
      
      // Construir la URL con los filtros adecuados
      let url = `http://localhost:8000/dashboard/api/admin-agenda/?start_date=${startDate}&end_date=${endDate}`;
      
      // Añadir filtro por administrador si es necesario
      if (selectedAdmin.value === 'own') {
        // No añadir parámetro, el backend filtrará por el usuario autenticado
      } else if (selectedAdmin.value !== 'all') {
        // Filtrar por un administrador específico
        url += `&admin=${selectedAdmin.value}`;
      }
      
      console.log("Cargando eventos desde:", url);
      
      // Hacer la petición al backend
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los eventos');
      }
      
      const data = await response.json();
      console.log("Eventos cargados:", data);
      events.value = data;
      
      // Cargar la lista de administradores si aún no se ha hecho
      if (admins.value.length === 0) {
        loadAdmins();
      }
      
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Cargar lista de administradores
  const loadAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch('http://localhost:8000/dashboard/api/teachers/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar administradores');
      }
      
      const data = await response.json();
      console.log("Administradores cargados:", data);
      admins.value = data;
      
    } catch (err) {
      console.error('Error al cargar administradores:', err);
    }
  };
  
  // Formatear hora (HH:MM)
  const formatTime = (timeString: string) => {
    return timeString;
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Calcular hora de fin basada en la hora de inicio y la duración
  const calculateEndTime = (event: Event) => {
    const [hours, minutes] = event.time.split(':').map(Number);
    
    // Crear una fecha base y añadir la hora de inicio
    const startTime = new Date(1970, 0, 1, hours, minutes);
    
    // Añadir la duración en minutos
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    
    // Formatear la hora de fin
    return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Obtener eventos para una celda específica (fecha y hora)
  const getEventsForTimeSlot = (date: Date, hour: number) => {
    // Convertir la fecha a formato YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // Filtrar eventos que ocurren en esta fecha y hora
    return events.value.filter(event => {
      // Verificar si el evento es para esta fecha
      if (event.date !== dateString) return false;
      
      // Obtener la hora de inicio del evento
      const eventHour = parseInt(event.time.split(':')[0]);
      
      // Verificar si el evento comienza en esta hora
      return eventHour === hour;
    });
  };
  
  // Definir colores para cada categoría
  const categoryColors = {
    tutoring: '#4CAF50',  // Verde
    meeting: '#2196F3',   // Azul
    workshop: '#FF9800',  // Naranja
    webinar: '#9C27B0',   // Púrpura
    other: '#607D8B',     // Gris
  };
  
  // Obtener nombre de la categoría
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      tutoring: 'Tutoría',
      meeting: 'Reunión',
      workshop: 'Taller',
      webinar: 'Webinar',
      other: 'Otro'
    };
    return categories[category] || category;
  };
  
  // Obtener nombre del estado
  const getStatusName = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Pendiente',
      registered: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Completado'
    };
    return statuses[status] || status;
  };
  
  // Calcular el estilo del evento basado en su duración y categoría
  const calculateEventStyle = (event: Event) => {
    // Calcular altura basada en la duración (1 hora = 60px)
    const heightInPixels = (event.duration / 60) * 60;
    
    // Obtener el color de la categoría
    const backgroundColor = categoryColors[event.category as keyof typeof categoryColors] || '#607D8B'; // Color por defecto si no se encuentra la categoría
    
    return {
      height: `${heightInPixels}px`,
      backgroundColor, // Aplicar el color de fondo
      // Otros estilos que quieras aplicar
    };
  };
  
  // Mostrar detalles del evento
  const showEventDetails = async (event: Event) => {
    selectedEvent.value = event;
    await loadParticipants(event.id);
    // Resetear el modo de edición
    editMode.value = false;
    editingEvent.value = null;
    editError.value = '';
  };
  
  // Cerrar detalles del evento
  const closeEventDetails = () => {
    selectedEvent.value = null;
    participants.value = [];
  };
  
  // Cargar participantes de un evento
  const loadParticipants = async (eventId: number) => {
    try {
      loadingParticipants.value = true;
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/?admin_agenda=${eventId}&status=registered`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar participantes');
      }
      
      const data = await response.json();
      console.log("Participantes cargados:", data);
      participants.value = data;
      
    } catch (err) {
      console.error('Error al cargar participantes:', err);
    } finally {
      loadingParticipants.value = false;
    }
  };
  
  // Actualizar estado de un participante
  const updateParticipantStatus = async (participantId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      
      const response = await fetch(`http://localhost:8000/dashboard/api/participant-agenda/${participantId}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }
      
      // Actualizar la lista de participantes
      if (selectedEvent.value) {
        await loadParticipants(selectedEvent.value.id);
        // También recargar eventos para actualizar los cupos disponibles
        await loadEvents();
      }
      
    } catch (err) {
      console.error('Error al actualizar estado:', err);
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
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-group select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
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
  
  .event.own-event {
    border: 2px solid white;
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
  
  .event-spots {
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Modal de detalles del evento */
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
  
  .event-modal {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #333;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }
  
  .close-button:hover {
    color: #333;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .event-info {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .event-info p {
    margin: 0.5rem 0;
  }
  
  .participants-section h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .loading-participants, .no-participants {
    padding: 1rem;
    text-align: center;
    color: #888;
  }
  
  .participants-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .participant-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9f9f9;
    border-radius: 4px;
    border-left: 4px solid #ddd;
  }
  
  .participant-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .participant-email {
    font-weight: bold;
  }
  
  .participant-status {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: inline-block;
  }
  
  .participant-status.pending {
    background-color: #FFF3CD;
    color: #856404;
  }
  
  .participant-status.registered {
    background-color: #D1ECF1;
    color: #0C5460;
  }
  
  .participant-status.cancelled {
    background-color: #F8D7DA;
    color: #721C24;
  }
  
  .participant-status.completed {
    background-color: #D4EDDA;
    color: #155724;
  }
  
  .participant-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .status-button {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background-color 0.2s;
  }
  
  .completed-button {
    background-color: #28A745;
    color: white;
  }
  
  .completed-button:hover {
    background-color: #218838;
  }
  
  .cancel-button {
    background-color: #DC3545;
    color: white;
  }
  
  .cancel-button:hover {
    background-color: #C82333;
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
    
    .event-modal {
      width: 95%;
    }
    
    .participant-item {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .participant-actions {
      margin-top: 0.5rem;
      width: 100%;
    }
    
    .status-button {
      flex: 1;
    }
  }
  </style>