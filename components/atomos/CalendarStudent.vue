<template>
  <div class="calendar-container">
    <h2>Calendario de Inicios de Sesión</h2>
    <div>
      <button @click="prevMonth">Mes Anterior</button>
      <span>{{ currentMonth }} {{ currentYear }}</span>
      <button @click="nextMonth">Mes Siguiente</button>
    </div>
    <div class="calendar">
      <div class="header">
        <div v-for="day in days" :key="day" class="day-header">{{ day }}</div>
      </div>
      <div class="body">
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week">
          <div
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            :class="[
              'day',
              {
                'empty': day.empty,
                'logged-in': !day.empty && loggedInDays.some(
                  d => d.toDateString() === day.date.toDateString()
                )
              }
            ]"
          >
            {{ day.empty ? '' : day.date.getDate() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { axiosDashboard } from '../../services/axios.config'

// Variables reactivas para el calendario
const loggedInDays = ref([])  // Almacena los días en que el estudiante inició sesión
const weeks = ref([])         // Almacena las semanas del calendario
const currentMonth = ref(new Date().getMonth())     // Mes actual
const currentYear = ref(new Date().getFullYear())   // Año actual

// Obtener los días de login del estudiante desde la API
const fetchLoginDays = async () => {
  try {
    const studentId = localStorage.getItem('studentId')
    const response = await axiosDashboard.get('/student-login-record/', {
      params: {
        student_id: studentId
      }
    })
    // Convertir las fechas string a objetos Date
    loggedInDays.value = response.data.map(record => new Date(record.login_date + 'T00:00:00'))
  } catch (error) {
    console.error('Error al obtener los días de login:', error)
  }
}

// Array con los nombres de los días de la semana
const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Función para generar la estructura del calendario
const generateCalendar = () => {
  const startOfMonth = new Date(currentYear.value, currentMonth.value, 1)    // Primer día del mes
  const endOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)  // Último día del mes
  
  // Obtener el día de la semana del primer día del mes (0-6)
  const firstDayOfWeek = startOfMonth.getDay()
  
  // Crear array para todos los días del mes
  const calendarDays = []
  
  // Agregar días vacíos al principio si es necesario
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ date: null, empty: true })
  }
  
  // Agregar los días del mes
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    calendarDays.push({
      date: new Date(currentYear.value, currentMonth.value, i),
      empty: false
    })
  }
  
  // Limpiar las semanas anteriores
  weeks.value = []
  
  // Agrupar los días en semanas
  let currentWeek = []
  calendarDays.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.value.push(currentWeek)
      currentWeek = []
    }
  })
  
  // Agregar la última semana si tiene días
  if (currentWeek.length > 0) {
    // Rellenar con días vacíos si es necesario
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, empty: true })
    }
    weeks.value.push(currentWeek)
  }
}

// Función para ir al mes anterior
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  generateCalendar()
}

// Función para ir al mes siguiente
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  generateCalendar()
}

// Inicializar el calendario cuando el componente se monta
onMounted(() => {
  generateCalendar()
  fetchLoginDays()
})
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.calendar {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.day-header {
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.body {
  display: flex;
  flex-direction: column;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day {
  padding: 15px;
  text-align: center;
  border: 1px solid #eee;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  background-color: #f8f9fa;
}

.logged-in {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.day:hover:not(.empty) {
  background-color: #e9ecef;
  cursor: pointer;
}

.logged-in:hover {
  background-color: #0056b3;
}
</style>
