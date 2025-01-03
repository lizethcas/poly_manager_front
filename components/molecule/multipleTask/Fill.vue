<template>
  <div>
    <!-- Help text section if provided -->
    <p v-if="help_text" class="text-sm text-gray-600 mb-2">Hint: {{ help_text }}</p>
    <!-- Muestra el texto formateado con las keywords en negrita -->
    <p v-html="formattedText"></p>
  </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  text: string;
  keywords: string[];
  help_text: string;
}

// Define props and store them in a variable
const props = defineProps<Props>();

// Now use props.keywords to access the keywords array
const formattedText = computed(() => {
  const replacement = props.keywords.map(keyword => `<b>${keyword}</b>`).join(" / ");
  return props.text.replace("__1__", replacement);
});
</script>
  