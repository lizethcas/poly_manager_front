<template>
  <div class="w-full">
    <div class="w-full">
      <UInput
        v-model="q"
        name="q"
        placeholder="Buscar"
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        @click="handleSearchInput()"
      >
      </UInput>
    </div>
    <h1 v-show="q !== ''">{{ q }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const q: Ref<string> = ref("");

// Watch for changes in q
watch(q, (newValue) => {
  console.log('Search input value:', newValue);
});

const handleSearchInput = () => {
  q.value = '';
  console.log("algo");
}
</script>
