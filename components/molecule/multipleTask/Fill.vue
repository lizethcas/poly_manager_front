<template>
  <div>
    <!-- Loop through passages -->
    <div v-for="(passage, index) in passages" :key="index" class="mb-4">
      <!-- Help text section if provided -->
      <p v-if="passage.help_text" class="text-sm text-gray-600 mb-2">
        Hint: {{ passage.help_text }}
      </p>
      <!-- Display formatted text for each passage -->
      <p v-html="getFormattedText(passage)"></p>
    </div>
  </div>
</template>
  
<script setup lang="ts">
interface Passage {
  text: string;
  keywords: string[];
  help_text: string;
}

interface Props {
  passages: Passage[];
}

const props = defineProps<Props>();

// Function to format text for each passage
const getFormattedText = (passage: Passage) => {
  const replacement = passage.keywords.map(keyword => `<b>${keyword}</b>`).join(" / ");
  return passage.text.replace("__1__", replacement);
};
</script>
  