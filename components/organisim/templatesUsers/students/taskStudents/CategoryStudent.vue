<template>
  <div class="p-4">
    <draggable v-model="items" class="space-y-4" @end="onEnd">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="p-4 border rounded-lg bg-gray-100 shadow-md cursor-grab"
      >
        {{ item }}
      </div>
    </draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from "vuedraggable";

const items = ref(["Elemento 1", "Elemento 2", "Elemento 3"]);

const onEnd = (event) => {
  console.log("Orden cambiado:", items.value);
};
</script>