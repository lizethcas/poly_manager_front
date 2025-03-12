<template>
  <div
    class="calendar-container bg-white rounded-lg shadow-sm border border-gray-200 max-w-6xl mx-auto"
  >
    <!-- <AgendaForm @agendaCreated="loadEvents" /> -->

    <!-- Filtro de administradores con nuevo estilo -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <label for="adminFilter" class="text-sm font-medium text-gray-600"
          >Ver eventos de:</label
        >
        <select
          id="adminFilter"
          v-model="selectedAdmin"
          @change="loadEvents"
          class="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="own">Mis eventos</option>
          <option value="all">Todos los eventos</option>
          <option v-for="admin in admins" :key="admin.id" :value="admin.id">
            {{ admin.user_email }}
          </option>
        </select>
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

      <button
      @click="openAgendaModal"
      class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
    >
      <Icon name="material-symbols:add" class="h-4 w-4 inline mr-1" />
      Crear Agenda
    </button>
    </div>

    <!-- Calendario principal -->
    <div class="calendar-grid">
      <!-- Columna de horas -->
      <div class="time-labels bg-gray-50 border-r border-gray-200">
        <div
          class="timezone h-12 flex items-center justify-center border-b border-gray-200 text-xs text-gray-500"
        >
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
            <div class="day-name text-xs text-gray-500">
              {{ days[date.getDay()] }}
            </div>
            <div class="day-number text-sm font-semibold text-gray-700">
              {{ date.getDate() }}
            </div>
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
                'current-time-indicator': isCurrentTimeSlot(date, hour),
              }"
            >
              <!-- Eventos en esta celda -->
              <div
                v-for="event in getEventsForTimeSlot(date, hour)"
                :key="event.id"
                class="event absolute z-10 rounded-md shadow-sm p-1.5 overflow-hidden"
                :style="calculateEventStyle(event)"
                :class="{
                  available: event.available,
                  'own-event': isOwnEvent(event),
                }"
                @click="showEventDetails(event)"
              >
                <div class="event-title text-xs font-medium truncate">
                  {{ event.title }}
                </div>
                <div class="event-time text-[10px] text-white/90 truncate">
                  {{ formatTime(event.time) }} - {{ calculateEndTime(event) }}
                </div>
                <div class="event-spots text-[10px] truncate">
                  {{ event.spots_available }}/{{ event.max_participants }} cupos
                </div>

                <!-- Participantes (avatares) -->
                <div class="flex -space-x-1 mt-1">
                  <div
                    class="w-5 h-5 rounded-full bg-white/30 text-[8px] flex items-center justify-center"
                  >
                    {{ event.spots_available }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del evento (mantener igual) -->
    <!-- Modal de detalles del evento con diseño moderno -->
    <div
      v-if="selectedEvent"
      class="event-modal-backdrop"
      @click="closeEventDetails"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header del modal -->
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Detalles del evento</h3>
          <button
            @click="closeEventDetails"
            class="text-gray-400 hover:text-gray-500"
          >
            <Icon name="mdi:close" class="h-5 w-5" />
          </button>
        </div>

        <!-- Contenido del modal -->
        <div class="p-4 space-y-4">
          <!-- Título y categoría -->
          <div>
            <h2 class="text-xl font-bold text-gray-800">
              {{ selectedEvent.title }}
            </h2>
            <div
              class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :style="{
                backgroundColor: getCategoryColorLight(selectedEvent.category),
                color: getCategoryColor(selectedEvent.category),
              }"
            >
              {{ getCategoryName(selectedEvent.category) }}
            </div>
          </div>

          <!-- Fecha y hora -->
          <div class="flex items-start space-x-3">
            <Icon name="mdi:calendar" class="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(selectedEvent.date) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatTime(selectedEvent.time) }} -
                {{ calculateEndTime(selectedEvent) }} ({{
                  selectedEvent.duration
                }}
                minutos)
              </p>
            </div>
          </div>

          <!-- Cupos -->
          <div class="flex items-start space-x-3">
            <Icon
              name="mdi:account-multiple"
              class="h-5 w-5 text-gray-400 mt-0.5"
            />
            <div class="w-full">
              <p class="text-sm font-medium text-gray-900">
                {{
                  selectedEvent.max_participants -
                  selectedEvent.spots_available
                }}/{{ selectedEvent.max_participants }} cupos ocupados
              </p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-blue-500 h-2 rounded-full"
                  :style="{
                    width: `${
                      ((selectedEvent.max_participants -
                        selectedEvent.spots_available) /
                        selectedEvent.max_participants) *
                      100
                    }%`,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div class="flex items-start space-x-3">
            <Icon
              name="mdi:file-document-outline"
              class="h-5 w-5 text-gray-400 mt-0.5"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">Descripción</p>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedEvent.description || "Sin descripción" }}
              </p>
            </div>
          </div>

          <!-- Creado por -->
          <div class="flex items-start space-x-3">
            <Icon name="mdi:account" class="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-900">Creado por</p>
              <p class="text-sm text-gray-600 mt-1">
                {{ selectedEvent.admin_email }}
              </p>
            </div>
          </div>

          <!-- Participantes -->
          <div class="flex items-start space-x-3">
            <Icon
              name="mdi:account-group"
              class="h-5 w-5 text-gray-400 mt-0.5"
            />
            <div class="w-full">
              <p class="text-sm font-medium text-gray-900">
                Participantes inscritos ({{ participants.length }})
              </p>

              <div
                v-if="loadingParticipants"
                class="mt-2 p-4 text-center text-gray-500"
              >
                <Icon name="mdi:loading" class="h-6 w-6 animate-spin mx-auto" />
                <p class="text-sm mt-2">Cargando participantes...</p>
              </div>

              <div
                v-else-if="participants.length === 0"
                class="mt-2 p-4 text-center text-gray-500 bg-gray-50 rounded-lg"
              >
                <p class="text-sm">
                  No hay participantes inscritos en este evento.
                </p>
              </div>

              <div v-else class="mt-2 space-y-2">
                <div
                  v-for="participant in participants"
                  :key="participant.id"
                  class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div class="flex items-center space-x-2">
                    <Icon
                      name="mdi:account-circle"
                      class="h-8 w-8 text-gray-400"
                    />
                    <div>
                      <span class="text-sm font-medium">{{
                        participant.participant_email
                      }}</span>
                      <div
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2"
                        :class="getStatusClass(participant.status)"
                      >
                        {{ getStatusName(participant.status) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      v-if="participant.status !== 'completed'"
                      @click="
                        updateParticipantStatus(participant.id, 'completed')
                      "
                      class="px-2 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                    >
                      Completado
                    </button>
                    <button
                      v-if="participant.status !== 'cancelled'"
                      @click="
                        updateParticipantStatus(participant.id, 'cancelled')
                      "
                      class="px-2 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="p-4 border-t flex justify-end space-x-2">
          <button
            @click="closeEventDetails"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
  <AgendaForm
    :isOpen="showAgendaModal"
    @close="closeAgendaModal"
    @agendaCreated="handleAgendaCreated"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AgendaForm from "./AgendaForm.vue";

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
  status: "pending" | "registered" | "cancelled" | "completed";
  notes?: string;
  registered_at: string;
  updated_at: string;
}

const currentDate = ref(new Date());
const showAgendaModal = ref(false);

const openAgendaModal = () => {
  showAgendaModal.value = true;
};

const closeAgendaModal = () => {
  showAgendaModal.value = false;
};

const days = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const events = ref<Event[]>([]);
const isLoading = ref(false);
const error = ref("");
const selectedEvent = ref<Event | null>(null);
const participants = ref<Participant[]>([]);
const loadingParticipants = ref(false);
const admins = ref<Admin[]>([]);
const selectedAdmin = ref("own"); // 'own', 'all', o ID de un administrador específico

// Variables para la edición de eventos
const editMode = ref(false);
const editingEvent = ref<Event | null>(null);
const isSaving = ref(false);
const editError = ref("");

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
  return `${firstDate.toLocaleDateString("es", {
    month: "long",
    day: "numeric",
  })} - ${lastDate.toLocaleDateString("es", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
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
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear() &&
    hour === now.getHours()
  );
};

// Verificar si es hoy
const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

// Verificar si el evento es del administrador actual
const isOwnEvent = (event: Event) => {
  try {
    console.log("Verificando si el evento es propio:", event);

    // Obtener el ID del administrador actual del localStorage
    const userString = localStorage.getItem("user");
    if (!userString) {
      console.log("No hay datos de usuario en localStorage");
      return false;
    }

    const userData = JSON.parse(userString);
    console.log("Datos de usuario completos:", userData);

    // Verificar si el usuario tiene un teachermodel_id
    if (userData && userData.teachermodel_id) {
      const teacherModelId = userData.teachermodel_id;
      console.log(
        `Comparando: evento admin=${event.admin}, usuario teachermodel_id=${teacherModelId}`
      );

      // Convertir ambos valores a números para asegurar una comparación correcta
      return Number(event.admin) === Number(teacherModelId);
    }

    console.log("El usuario no tiene teachermodel_id");
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
    error.value = "";

    // Obtener el token de autenticación
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa");
    }

    // Calcular fechas para filtrar eventos
    const startDate = weekDates.value[0].toISOString().split("T")[0];
    const endDate = weekDates.value[6].toISOString().split("T")[0];

    // Construir la URL con los filtros adecuados
    let url = `http://localhost:8000/dashboard/api/admin-agenda/?start_date=${startDate}&end_date=${endDate}`;

    // Añadir filtro por administrador si es necesario
    if (selectedAdmin.value === "own") {
      // No añadir parámetro, el backend filtrará por el usuario autenticado
    } else if (selectedAdmin.value !== "all") {
      // Filtrar por un administrador específico
      url += `&admin=${selectedAdmin.value}`;
    }

    console.log("Cargando eventos desde:", url);

    // Hacer la petición al backend
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar los eventos");
    }

    const data = await response.json();
    console.log("Eventos cargados:", data);
    events.value = data;

    // Cargar la lista de administradores si aún no se ha hecho
    if (admins.value.length === 0) {
      loadAdmins();
    }
  } catch (err) {
    console.error("Error al cargar eventos:", err);
    error.value = err instanceof Error ? err.message : "Error desconocido";
  } finally {
    isLoading.value = false;
  }
};

// Cargar lista de administradores
const loadAdmins = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa");
    }

    const response = await fetch(
      "http://localhost:8000/dashboard/api/teachers/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar administradores");
    }

    const data = await response.json();
    console.log("Administradores cargados:", data);
    admins.value = data;
  } catch (err) {
    console.error("Error al cargar administradores:", err);
  }
};

// Formatear hora (HH:MM)
const formatTime = (timeString: string) => {
  return timeString;
};

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calcular hora de fin basada en la hora de inicio y la duración
const calculateEndTime = (event: Event) => {
  const [hours, minutes] = event.time.split(":").map(Number);

  // Crear una fecha base y añadir la hora de inicio
  const startTime = new Date(1970, 0, 1, hours, minutes);

  // Añadir la duración en minutos
  const endTime = new Date(startTime.getTime() + event.duration * 60000);

  // Formatear la hora de fin
  return `${endTime.getHours().toString().padStart(2, "0")}:${endTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

// Obtener eventos para una celda específica (fecha y hora)
const getEventsForTimeSlot = (date: Date, hour: number) => {
  // Convertir la fecha a formato YYYY-MM-DD
  const dateString = date.toISOString().split("T")[0];

  // Filtrar eventos que ocurren en esta fecha y hora
  return events.value.filter((event) => {
    // Verificar si el evento es para esta fecha
    if (event.date !== dateString) return false;

    // Obtener la hora de inicio del evento
    const eventHour = parseInt(event.time.split(":")[0]);

    // Verificar si el evento comienza en esta hora
    return eventHour === hour;
  });
};

// Definir colores para cada categoría
const categoryColors = {
  tutoring: "#4CAF50", // Verde
  meeting: "#2196F3", // Azul
  workshop: "#FF9800", // Naranja
  webinar: "#9C27B0", // Púrpura
  other: "#607D8B", // Gris
};

// Obtener nombre de la categoría
const getCategoryName = (category: string) => {
  const categories: Record<string, string> = {
    tutoring: "Tutoría",
    meeting: "Reunión",
    workshop: "Taller",
    webinar: "Webinar",
    other: "Otro",
  };
  return categories[category] || category;
};

// Obtener nombre del estado
const getStatusName = (status: string) => {
  const statuses: Record<string, string> = {
    pending: "Pendiente",
    registered: "Confirmado",
    cancelled: "Cancelado",
    completed: "Completado",
  };
  return statuses[status] || status;
};

// Calcular el estilo del evento basado en su duración y categoría
const calculateEventStyle = (event: Event) => {
  // Calcular altura basada en la duración (1 hora = 60px)
  const heightInPixels = (event.duration / 60) * 60;

  // Obtener el color de la categoría
  const backgroundColor =
    categoryColors[event.category as keyof typeof categoryColors] || "#607D8B"; // Color por defecto si no se encuentra la categoría

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
  editError.value = "";
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

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa");
    }

    const response = await fetch(
      `http://localhost:8000/dashboard/api/participant-agenda/?admin_agenda=${eventId}&status=registered`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar participantes");
    }

    const data = await response.json();
    console.log("Participantes cargados:", data);
    participants.value = data;
  } catch (err) {
    console.error("Error al cargar participantes:", err);
  } finally {
    loadingParticipants.value = false;
  }
};

// Añadir al script del componente

// Obtener color de la categoría (para texto)
const getCategoryColor = (category) => {
  const colors = {
    tutoring: "#2e7d32", // Verde oscuro
    meeting: "#1565c0", // Azul oscuro
    workshop: "#e65100", // Naranja oscuro
    webinar: "#6a1b9a", // Púrpura oscuro
    other: "#455a64", // Gris oscuro
  };
  return colors[category] || "#455a64";
};

// Obtener color claro de la categoría (para fondo)
const getCategoryColorLight = (category) => {
  const colors = {
    tutoring: "#e8f5e9", // Verde claro
    meeting: "#e3f2fd", // Azul claro
    workshop: "#fff3e0", // Naranja claro
    webinar: "#f3e5f5", // Púrpura claro
    other: "#eceff1", // Gris claro
  };
  return colors[category] || "#eceff1";
};

// Obtener clase para el estado del participante
const getStatusClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800",
    registered: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

// Actualizar estado de un participante
const updateParticipantStatus = async (
  participantId: number,
  newStatus: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay sesión activa");
    }

    const response = await fetch(
      `http://localhost:8000/dashboard/api/participant-agenda/${participantId}/update_status/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar estado");
    }

    // Actualizar la lista de participantes
    if (selectedEvent.value) {
      await loadParticipants(selectedEvent.value.id);
      // También recargar eventos para actualizar los cupos disponibles
      await loadEvents();
    }
  } catch (err) {
    console.error("Error al actualizar estado:", err);
  }
};

// Manejar la creación de una nueva agenda
const handleAgendaCreated = () => {
  loadEvents();
};

// Cargar eventos al montar el componente
onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
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
  content: "";
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.event.available {
  opacity: 1;
}

.event:not(.available) {
  opacity: 0.7;
}

.event.own-event {
  box-shadow: 0 0 0 2px white;
}

/* Mantener los estilos del modal igual */
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
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
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
  font-size: 1.25rem;
}

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

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  color: #333;
  background-color: #f1f5f9;
}

.modal-body {
  padding: 1.5rem;
}

/* Estilos del participante y otros detalles que quieres mantener */
.participants-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.loading-participants,
.no-participants {
  padding: 1rem;
  text-align: center;
  color: #888;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: 60px 1fr;
  }
}
</style>
