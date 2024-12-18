<template>
    <!-- Muestra el texto formateado con las keywords en negrita -->
    <p v-html="formattedText"></p>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Variables reactivas con los valores originales
  const text = "1. I __1__ tennis.";
  const keywords = ["to play", "am playing"];
  
  // Computada que reemplaza el marcador en el texto
  const formattedText = computed(() => {
    // Une los keywords con un separador "/" y aplica etiquetas <b> para la negrita
    const replacement = keywords.map(keyword => `<b>${keyword}</b>`).join(" / ");
    // Reemplaza "__1__" con los keywords formateados
    return text.replace("__1__", replacement);
  });
  </script>
  