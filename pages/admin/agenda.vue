<template>
    <div class="agenda-container">
      <div class="page-header">
        <h1 class="page-title">Mi Agenda</h1>
        <p class="page-description">
          Visualiza y administra tus eventos, tutorías, talleres y reuniones. Usa los filtros para encontrar
          eventos disponibles o ver aquellos en los que ya estás inscrito.
        </p>
      </div>
      
      <div class="calendar-wrapper">
        <Calendar2 />
      </div>
      
      <div class="instructions-container">
        <h2 class="instructions-title">¿Cómo usar la agenda?</h2>
        <div class="instructions-grid">
          <div class="instruction-card">
            <div class="instruction-icon">👁️</div>
            <h3>Ver eventos</h3>
            <p>Navega entre semanas con los botones "Anterior" y "Siguiente".</p>
          </div>
          <div class="instruction-card">
            <div class="instruction-icon">🔍</div>
            <h3>Filtrar eventos</h3>
            <p>Utiliza los botones de filtro para ver todos los eventos, solo los disponibles o en los que ya estás inscrito.</p>
          </div>
          <div class="instruction-card">
            <div class="instruction-icon">📝</div>
            <h3>Gestionar inscripciones</h3>
            <p>Haz clic en cualquier evento para ver sus detalles, inscribirte o cancelar tu inscripción.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Calendar2 from '~/components/Calendar2.vue';
  </script>
  
  <style scoped>
  .agenda-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .page-header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .page-title {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .page-description {
    font-size: 1.1rem;
    color: #666;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .calendar-wrapper {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 3rem;
  }
  
  .instructions-container {
    padding: 2rem 0;
  }
  
  .instructions-title {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .instructions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .instruction-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .instruction-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .instruction-card h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .instruction-card p {
    color: #666;
    line-height: 1.5;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }
    
    .page-description {
      font-size: 1rem;
    }
    
    .instructions-title {
      font-size: 1.5rem;
    }
    
    .instructions-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>